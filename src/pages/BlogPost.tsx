import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getPost, POSTS, type Block } from '../data/posts'
import { Seo, SITE_URL } from '../components/Seo'

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case 'h2':
      return <h2 className="text-xl font-semibold text-white mt-8 mb-3">{block.text}</h2>
    case 'p':
      return <p className="text-gray-300 leading-relaxed mb-4">{block.text}</p>
    case 'ul':
      return (
        <ul className="text-gray-300 space-y-2 list-disc list-inside mb-4">
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )
    case 'tip':
      return (
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg px-4 py-3 mb-4">
          <span className="text-blue-300 text-sm leading-relaxed">💡 {block.text}</span>
        </div>
      )
  }
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) return <Navigate to="/blog" replace />

  const related = POSTS.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: '주식 스크리너' },
    publisher: { '@type': 'Organization', name: '주식 스크리너' },
  }

  return (
    <article>
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        article
        jsonLd={jsonLd}
      />

      <Link to="/blog" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 칼럼 목록
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-400 text-xs font-semibold bg-blue-900/30 px-2 py-0.5 rounded">{post.category}</span>
        <span className="text-gray-500 text-xs">{post.date}</span>
        <span className="text-gray-600 text-xs">· 약 {post.readMin}분</span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3 leading-snug">{post.title}</h1>
      <p className="text-gray-400 text-base mb-8 leading-relaxed">{post.description}</p>

      <div className="border-t border-gray-800 pt-8">
        {post.body.map((block, i) => <BlockView key={i} block={block} />)}
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3 mt-8">
        <p className="text-gray-500 text-xs leading-relaxed">
          본 글은 일반적인 투자 교육을 목적으로 하며 특정 종목의 매매를 권유하지 않습니다.
          투자 결정은 본인의 판단과 책임하에 이루어져야 합니다.
        </p>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-white font-semibold mb-4">함께 읽으면 좋은 글</h2>
          <div className="space-y-3">
            {related.map(r => (
              <Link
                key={r.slug}
                to={`/blog/${r.slug}`}
                className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-blue-700 transition-colors"
              >
                <h3 className="text-white font-medium text-sm mb-1">{r.title}</h3>
                <p className="text-gray-500 text-xs">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
