import { createDefaultContext } from './context.js'
import { renderToString } from '@vue/server-renderer'
import { getMeta } from './meta.config.js'
import { createFaviconLink } from '@shared/favicon.js'
import { determineLanguage } from '@shared/util.js'
import { JSDOM } from 'jsdom'
import { exportStates } from '@vue/apollo-ssr'

import { brotliCompressSync, gzipSync } from 'zlib'
import devalue from '@nuxt/devalue'
import { addEvents } from '@shared/tags/ssr.js'

import { basename } from 'path'

import mime from 'mime'
const { getType } = mime

import jsonwt from 'jsonwebtoken'
const { sign } = jsonwt

import type { Request, Response } from 'express'

import { env } from 'process'
import type { SSRContext } from '@shared/ssrContext.js'
import type { BundleArgs, createDefaultApp as CreateDefaultApp } from '@shared/app.js'

let networkToken: string | undefined

function getNetworkToken()
{
  if (!networkToken)
    networkToken = sign({ fromServer: true }, env.JWT_SECRET_SHARED ?? 'DEFAULT_JWT_SECRET')
  return networkToken
}

function renderPreloadLinks(modules: Set<string>, manifest: Record<string, Array<string>>)
{
  let links = ''
  const seen = new Set()
  modules.forEach((id) =>
  {
    const files = manifest[id]
    if (files)
    {
      files.forEach((file) =>
      {
        if (!seen.has(file))
        {
          seen.add(file)
          const filename = basename(file)
          if (manifest[filename])
          {
            for (const depFile of manifest[filename])
            {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file: string)
{
  if (file.match(/\.[mc]?js/))
  {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  }
  else if (file.endsWith('.css'))
  {
    return `<link rel="stylesheet" href="${file}">`
  }

  const type = getType(file)
  if (!type)
    throw new Error("Missing mime type")

  if (type.startsWith('font'))
  {
    return `<link rel="preload" href="${file}" as="font" type="${type}">`
  }
  else if (type.startsWith('image'))
  {
    return `<link rel="preload" href="${file}" as="image" type="${type}">`
  }
  throw new Error("Unhandeled mime type")
}

function addStyles(dom: JSDOM, styles: SSRContext["styles"])
{
  const doc = dom.window.document
  const head = doc.head

  for (let [id, css] of Object.entries(styles))
  {
    const node = doc.createElement('style')
    node.id = id
    node.innerHTML = css
    head.append(node)
  }
}

export default async function ssr(htmlBlueprint: string | JSDOM, manifest: Record<string, Array<string>>, bundle: any, req: Request, res: Response)
{
  const contextLoad = createDefaultContext()
  const language = determineLanguage(req.path)

  const nonce: string = res.locals.cspNonce

  let args: BundleArgs =
  {
    storeState: { isUniNetwork: res.locals!.isUni, nonce: nonce },
    locale: language,
    networkToken: (res.locals?.isUni) ? getNetworkToken() : undefined
  }

  const { createDefaultApp }: { createDefaultApp: typeof CreateDefaultApp } = bundle
  const { router, app, pinia, tagManager, apolloClients } = await createDefaultApp(args)

  router.push(req.url)
  await router.isReady()

  const currentRoute = router.currentRoute.value
  if (!currentRoute.matched.length) return res.status(404).end()

  const dom = (htmlBlueprint instanceof JSDOM) ? htmlBlueprint : new JSDOM(htmlBlueprint)

  const doc = dom.window.document
  const head = doc.head
  doc.children[0].setAttribute('lang', language)


  const context = await contextLoad
  context.nonce = nonce
  doc.getElementById('app')!.innerHTML = await renderToString(app, context)

  if (manifest && context.modules)
  {
    doc.head.innerHTML += renderPreloadLinks(context.modules, manifest)
  }

  addStyles(dom, context.styles)
  addEvents(dom, tagManager.data.tagData, nonce)
  head.innerHTML += `<title>${context.title}</title>`
  head.innerHTML += getMeta()
  head.innerHTML += await createFaviconLink(context.favicon!)
  //head.innerHTML += getStyles();

  /*if (res.locals?.isUni)
    {
      const condScript = doc.createElement('script')
      head.appendChild(condScript)
    }*/
    
  //@ts-ignore
  head.innerHTML += `<script nonce="${nonce}">window.__INITIAL_STATE__=${devalue(pinia.state.value)}</script>`
  head.innerHTML += `<script nonce="${nonce}">${exportStates(apolloClients)}</script>`

  const document = dom.serialize()

  res.status(context.statusCode)
  res.type('html')
  if (req.acceptsEncodings(['br']))
  {
    res.setHeader('Content-Encoding', "br")
    res.send(brotliCompressSync(document)).end()
  }
  else if (req.acceptsEncodings(['gzip']))
  {
    res.setHeader('Content-Encoding', "gzip")
    res.send(gzipSync(document)).end()
  }
  else
    res.send(document).end()
}