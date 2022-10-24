import ssrBase from './ssrBase'
//@ts-ignore
import * as bundle from '@distServer/app.mjs'
import ssrManifest from '@distClient/ssr-manifest.json'
import manifest from '@distClient/manifest.json'
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
      ssrBase(dom, ssrManifest, bundle, req, res)
    }
    catch (error)
    {
      console.log(error)
      return res.status(500).end("Internal Server Error")
    }
  }
}