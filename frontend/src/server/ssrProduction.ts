import ssrBase from './ssrBase'
//@ts-ignore
import * as bundle from '@distServer/app.mjs'
import ssrManifest from '@distClient/.vite/ssr-manifest.json' with { type: 'json'}
import manifest from '@distClient/.vite/manifest.json' with { type: 'json'}
import html from '../indexHtml'

import { JSDOM } from 'jsdom'

import type { NextFunction, Request, Response } from 'express'


export default function ssr()
{
  return async function (req: Request, res: Response, next: NextFunction)
  {
    if (!req.accepts('html') || req.method !== 'GET')
      return next()

    try
    {
      const dom = new JSDOM(html)
      dom.window.document.head.innerHTML +=
      `
        <link rel="stylesheet" href="/dist/${manifest['src/client/main.ts'].css}" />
        <script type="module" src="/dist/${manifest["src/client/main.ts"].file}"></script>
      `
      await ssrBase(dom, ssrManifest, bundle, req, res)
    }
    catch (error)
    {
      if (error instanceof Error)
      {
        console.log("[SSR-Render]:")
        console.log(error.stack)
      }
      res.status(500).end("Internal Server Error")
      return
    }
  }
}