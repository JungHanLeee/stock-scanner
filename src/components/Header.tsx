import React from 'react'
import { TrendingUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  market: string
  onMarketChange: (m: 'US' | 'KR' | 'ALL') => void
  total: number
  loading: boolean
}

export const Header: React.FC<HeaderProps> = ({ market, onMarketChange, total, loading }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-white font-bold text-lg tracking-tight">주식 스크리너</span>
            <span className="text-gray-500 text-xs ml-1 hidden sm:inline">Stock Screener KR</span>
          </Link>
          <nav className="hidden md:flex items-center gap-3 text-sm">
            <Link to="/guide" className="text-gray-400 hover:text-white transition-colors">투자 지표 가이드</Link>
            <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">투자 칼럼</Link>
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">소개</Link>
          </nav>
        </div>

        {/* 시장 탭 — 홈에서만 표시 */}
        {isHome && (
          <nav className="flex items-center gap-1">
            {(['US', 'KR', 'ALL'] as const).map(m => (
              <button
                key={m}
                onClick={() => onMarketChange(m)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  market === m
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {m === 'US' ? '🇺🇸 미국' : m === 'KR' ? '🇰🇷 한국' : '🌐 전체'}
              </button>
            ))}
          </nav>
        )}

        {/* 결과 수 — 홈에서만 */}
        {isHome && (
          <div className="text-gray-400 text-sm">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                로딩 중...
              </span>
            ) : (
              <span>
                <span className="text-white font-semibold">{total.toLocaleString()}</span>개 종목
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
