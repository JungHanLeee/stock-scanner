import { Seo } from '../components/Seo'

export default function AboutPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <Seo
        title="서비스 소개"
        description="미국·한국 주식을 30여 가지 재무 지표로 필터링하는 무료 주식 스크리너 소개. 제공 기능, 데이터 출처, 면책조항을 안내합니다."
        path="/about"
      />
      <h1 className="text-2xl font-bold text-white mb-2">주식 스크리너 소개</h1>
      <p className="text-gray-400 text-sm mb-8">Stock Screener KR — 미국·한국 주식 무료 스크리닝 서비스</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">서비스 소개</h2>
        <p className="text-gray-300 leading-relaxed">
          주식 스크리너는 미국과 한국 상장 주식을 다양한 재무 지표로 필터링하고 분석할 수 있는
          무료 스크리닝 서비스입니다. PER, PBR, ROE, 배당수익률, 시가총액 등 30여 가지 지표를
          조합해 자신만의 투자 기준에 맞는 종목을 손쉽게 발굴할 수 있습니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">주요 기능</h2>
        <ul className="text-gray-300 space-y-2 list-disc list-inside">
          <li>미국 NYSE·NASDAQ·AMEX 전 종목 스크리닝</li>
          <li>한국 KOSPI·KOSDAQ 전 종목 스크리닝</li>
          <li>가치평가 지표: PER, Forward PER, PEG, PBR, P/S, EV/EBITDA, P/OCF</li>
          <li>수익성 지표: ROE, ROA, ROIC, 영업이익률, 순이익률, 매출총이익률</li>
          <li>성장성 지표: EPS 성장률, 매출 성장률</li>
          <li>재무건전성: 유동비율, 부채비율</li>
          <li>배당: 배당수익률 필터</li>
          <li>종목별 3개월 차트 및 상세 재무정보</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">데이터 출처</h2>
        <p className="text-gray-300 leading-relaxed">
          미국 주식 데이터는 Yahoo Finance API를 통해 수집하며, 한국 주식 데이터는
          KRX(한국거래소) 공개 데이터를 FinanceDataReader 라이브러리를 통해 제공합니다.
          데이터는 실시간이 아닌 지연 데이터이며, 투자 결정의 유일한 근거로 사용하지 않도록 주의하시기 바랍니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">면책조항</h2>
        <p className="text-gray-300 leading-relaxed">
          본 서비스에서 제공하는 모든 정보는 투자 참고용입니다. 특정 종목에 대한 매수·매도를
          권유하거나 투자 수익을 보장하지 않습니다. 투자에 따른 손실은 투자자 본인이 부담하며,
          본 서비스는 이에 대한 어떠한 법적 책임도 지지 않습니다.
          투자 결정 전 반드시 전문 금융 자문가와 상담하시길 권장합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">문의</h2>
        <p className="text-gray-300">
          서비스 관련 문의나 제휴 제안은 아래 이메일로 연락해 주세요.<br />
          <a href="mailto:dlwjdgks126@gmail.com" className="text-blue-400 hover:text-blue-300">
            dlwjdgks126@gmail.com
          </a>
        </p>
      </section>
    </article>
  )
}
