import { Helmet } from 'react-helmet-async'

export const SITE_URL = 'https://stock-scanner-two.vercel.app'
const SITE_NAME = '주식 스크리너 | Stock Screener KR'
const DEFAULT_DESC =
  '미국·한국 주식을 PER, PBR, ROE, 배당수익률 등 30여 가지 재무 지표로 무료 필터링하는 주식 스크리너. 가치주·성장주·배당주를 손쉽게 발굴하세요.'

interface SeoProps {
  title?: string
  description?: string
  path?: string
  /** 블로그 글 등 article 타입 여부 */
  article?: boolean
  /** JSON-LD 구조화 데이터 (선택) */
  jsonLd?: object
}

export function Seo({ title, description, path = '/', article, jsonLd }: SeoProps) {
  const fullTitle = title ? `${title} | 주식 스크리너` : SITE_NAME
  const desc = description ?? DEFAULT_DESC
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ko_KR" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
