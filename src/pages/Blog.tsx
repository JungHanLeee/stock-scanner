import { Link } from 'react-router-dom'
import { POSTS } from '../data/posts'
import { Seo, SITE_URL } from '../components/Seo'

export default function BlogPage() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '주식 스크리너 투자 칼럼',
    url: `${SITE_URL}/blog`,
    blogPost: sorted.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  }

  return (
    <article>
      <Seo
        title="투자 칼럼"
        description="PER·ROE·배당·PEG 등 핵심 재무 지표 해설부터 스크리닝 실전 전략까지, 주식 투자에 바로 쓰는 원본 칼럼 모음."
        path="/blog"
        jsonLd={jsonLd}
      />
      <h1 className="text-2xl font-bold text-white mb-2">투자 칼럼</h1>
      <p className="text-gray-400 text-sm mb-10">
        재무 지표 해설부터 스크리닝 실전 전략까지 — 주식 투자에 바로 쓰는 글들을 정리했습니다.
      </p>

      <div className="space-y-4">
        {sorted.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 text-xs font-semibold bg-blue-900/30 px-2 py-0.5 rounded">
                {post.category}
              </span>
              <span className="text-gray-500 text-xs">{post.date}</span>
              <span className="text-gray-600 text-xs">· 약 {post.readMin}분</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-1">{post.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6 mt-10">
        <p className="text-gray-300 text-sm leading-relaxed">
          본 칼럼의 모든 내용은 일반적인 투자 교육을 목적으로 하며, 특정 종목의 매수·매도를
          권유하지 않습니다. 투자 결정은 본인의 판단과 책임하에 이루어져야 합니다.
        </p>
      </div>
    </article>
  )
}
