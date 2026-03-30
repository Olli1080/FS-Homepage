import { SitemapStream, streamToPromise } from 'sitemap'
import type { SitemapItem } from "sitemap"
import { routes } from './routes'
//import { WriteStream } from 'fs-extra'

let sitemap: Buffer | undefined

export async function getSiteMap(cache: boolean = true)
{
  if(sitemap)
    return sitemap

  await createSiteMap()
  return sitemap!
}

export async function createSiteMap()
{
  let stream = new SitemapStream({ hostname: "https://fsmpi.uni-bayreuth.de" })
  const baseUrl = "https://fsmpi.uni-bayreuth.de/"

  const localRoutes = routes.getLocalRoutes()
  const languages: SupportedLanguages[] = ['de', 'en']

  for (const lang of languages)
  {
    const langRoutes = localRoutes.get(lang)
    if (!langRoutes) continue

    for (const [key, route] of langRoutes)
    {
      let entry: SitemapItem = { url: baseUrl + route, img: [], video: [], links: [] }

      for (const altLang of languages)
      {
        const altRoute = localRoutes.get(altLang)?.get(key)
        if (altRoute !== undefined)
        {
          entry.links!.push({
            lang: altLang,
            url: baseUrl + altRoute
          })
        }
      }
      stream.write(entry)
    }
  }

  const pro = streamToPromise(stream).then(sm => sitemap = sm)

  stream.end()
  await pro
}