import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-16">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-white font-semibold text-sm">주식 스크리너</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/guide" className="hover:text-white transition-colors">투자 지표 가이드</Link>
            <Link to="/blog" className="hover:text-white transition-colors">투자 칼럼</Link>
            <Link to="/about" className="hover:text-white transition-colors">소개</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-gray-500 leading-relaxed">
          본 서비스는 투자 참고용 정보만을 제공하며, 투자 권유 또는 금융 자문을 목적으로 하지 않습니다.
          제공되는 모든 데이터는 Yahoo Finance, KRX 등 외부 소스에서 수집되며 실시간 데이터와 차이가 있을 수 있습니다.
          투자 결정은 본인의 판단과 책임하에 이루어져야 합니다.
        </p>
        <p className="mt-2 text-xs text-gray-600">© 2024 주식 스크리너. All rights reserved.</p>
      </div>
    </footer>
  )
}
