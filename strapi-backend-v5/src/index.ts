import type { Core } from '@strapi/strapi'
import type { Context } from 'koa'

import { GraphQLError } from 'graphql'
import { verify } from 'jsonwebtoken'
import { Netmask } from 'netmask'

const uniMask = new Netmask("132.180.0.1/16")
const fsLanMask = new Netmask("172.16.0.1/16")

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
   register({ strapi }: { strapi : Core.Strapi}) {
    const extensionService = strapi.plugin('graphql').service('extension');

    function isValidIp(context: Context)
    {
      const real_ip = context.http.request.header["x-real-ip"]

      if (!real_ip)
        return false

      return uniMask.contains(real_ip as string) ||	    
             fsLanMask.contains(real_ip as string)
    }
    
    function isValidJwt(context: Context)
    {
      const jwt: string | undefined = context.http.request.header['network-token'] as string
      //console.log(jwt)
      if (!jwt)
        return false
      try {
        const token = verify(jwt, process.env["JWT_SECRET_SHARED"] ?? 'DEFAULT_JWT_SECRET')
      }
      catch (err) {
        return false
      }
      return true
    }
    
    function checkUniNetwork(context: Context)
    {
      if (!isValidIp(context) && !isValidJwt(context))
        throw new GraphQLError('activate uni vpn', {
          extensions: {
            code: 'WRONG_NETWORK'
          }
        })
    }

    //console.log(extensionService.shadowCRUD('api::uni-kino-filme.uni-kino-filme').field('datum'))

    extensionService.use({
      //const res = 
      resolversConfig: {
        'Query.uniKinoFilmes': {
          policies: [
            (context, { strapi }) => {

              checkUniNetwork(context)

              return true;
            }
          ],
          auth: false
        },
        'UniKinoFilme.localizations': {
          policies: [
            (context, { strapi }) => {
              checkUniNetwork(context)

              return true;
            }
          ],
          auth: false
        }
      },
    })

    const extension = ({ nexus }) => ({
      // Nexus
      types: [
        nexus.extendType({
          type: 'Query',
          definition(t) {
            t.field('uniKinoDates', {
              type: nexus.nonNull(nexus.list('DateTime'))
            })
          }
        })
      ],
      resolvers: {
        Query: {
          uniKinoDates: {
            async resolve() {
              return (await strapi.documents('api::uni-kino-filme.uni-kino-filme').findMany({
                fields: ['datum'],
                sort: {
                  datum: 'asc'
                },
                status: 'published'
              })).map(({ datum }) => datum)
            },
          },
        },
      },
      resolversConfig: {
        'Query.uniKinoDates': {
          auth: false,
        },
      },
    });
    extensionService.use(extension)
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
