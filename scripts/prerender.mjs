// 빌드 후 정적 라우트를 HTML로 프리렌더(SSG)하고 sitemap.xml을 생성합니다.
// 브라우저(puppeteer) 없이 react-dom/server 로만 동작 → Vercel 빌드에서 안정적.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const toDist = (p) => path.resolve(root, 'dist', p)

const SITE_URL = 'https://stock-scanner-two.vercel.app'

// SSR 번들에서 render + 라우트 목록 로드
const { render, getRoutes } = await import(
  pathToFileURL(path.resolve(root, 'dist-server/entry-server.js')).href
)

const template = fs.readFileSync(toDist('index.html'), 'utf-8')

// 프리렌더 대상 라우트
const routes = getRoutes()

let success = 0
for (const url of routes) {
  let rendered
  try {
    rendered = render(url)
  } catch (e) {
    console.warn(`[prerender] skip ${url}: ${e.message}`)
    continue
  }

  const page = template
    // 정적 title/description 제거 → 페이지별 helmet 태그로 대체(중복 방지)
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('<!--app-head-->', rendered.head || '')
    .replace('<div id="root"></div>', `<div id="root">${rendered.html}</div>`)

  const outPath = url === '/' ? toDist('index.html') : toDist(`${url.slice(1)}/index.html`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, page)
  success++
  console.log(`[prerender] ${url} -> ${path.relative(root, outPath)}`)
}

// ── sitemap.xml 생성 ───────────────────────────────────────────
const urls = routes.map((r) => {
  const loc = `${SITE_URL}${r === '/' ? '' : r}`
  const priority = r === '/' ? '1.0' : r.startsWith('/blog/') ? '0.7' : '0.8'
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
})
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
fs.writeFileSync(toDist('sitemap.xml'), sitemap)
console.log(`[prerender] sitemap.xml (${routes.length} urls)`)

console.log(`[prerender] done: ${success}/${routes.length} routes`)
