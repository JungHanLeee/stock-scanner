import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import App from './App'
import { POSTS } from './data/posts'

/** 프리렌더 대상 정적 라우트 전체 목록 */
export function getRoutes(): string[] {
  return ['/', '/about', '/guide', '/privacy', '/blog', ...POSTS.map(p => `/blog/${p.slug}`)]
}

export function render(url: string): { html: string; head: string } {
  const helmetContext: { helmet?: HelmetServerState } = {}

  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  )

  const { helmet } = helmetContext
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].join('\n    ')
    : ''

  return { html, head }
}
