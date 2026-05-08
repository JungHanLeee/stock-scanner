interface MetricCardProps {
  name: string
  formula?: string
  good: string
  caution: string
  description: string
}

function MetricCard({ name, formula, good, caution, description }: MetricCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
      <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
      {formula && <p className="text-blue-400 text-sm font-mono mb-3">{formula}</p>}
      <p className="text-gray-300 leading-relaxed mb-4">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-green-900/30 border border-green-800 rounded-lg px-4 py-2">
          <span className="text-green-400 text-xs font-semibold block mb-1">일반적으로 좋은 수준</span>
          <span className="text-green-300 text-sm">{good}</span>
        </div>
        <div className="flex-1 bg-yellow-900/30 border border-yellow-800 rounded-lg px-4 py-2">
          <span className="text-yellow-400 text-xs font-semibold block mb-1">주의</span>
          <span className="text-yellow-300 text-sm">{caution}</span>
        </div>
      </div>
    </div>
  )
}

export default function GuidePage() {
  return (
    <article>
      <h1 className="text-2xl font-bold text-white mb-2">주식 투자 지표 완전 가이드</h1>
      <p className="text-gray-400 text-sm mb-10">
        주식 스크리너에서 사용하는 핵심 재무 지표들을 쉽게 설명합니다.
        각 지표의 의미와 해석 방법을 이해하면 더 나은 투자 결정을 내릴 수 있습니다.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">📊 가치평가 지표</h2>

        <MetricCard
          name="PER (주가수익비율, P/E Ratio)"
          formula="주가 ÷ 주당순이익(EPS)"
          description="기업의 주가가 이익 대비 얼마나 비싼지를 나타냅니다. PER 15라면 현재 이익 기준으로 투자금 회수에 15년이 걸린다는 의미입니다. 업종마다 평균 PER이 다르므로 같은 업종 내에서 비교하는 것이 중요합니다. 성장주는 미래 성장을 반영해 높은 PER을 보이는 경향이 있습니다."
          good="업종 평균 이하, 또는 성장률 대비 낮은 PER"
          caution="PER 음수(적자기업), 업종 평균 대비 지나치게 높은 PER"
        />

        <MetricCard
          name="Forward PER (선행 PER)"
          formula="주가 ÷ 향후 12개월 예상 EPS"
          description="미래 예상 이익을 기준으로 계산한 PER입니다. 현재 PER보다 Forward PER이 낮다면 이익 성장이 기대되는 기업입니다. 애널리스트 컨센서스 추정치를 사용하므로 실제 결과와 다를 수 있습니다."
          good="현재 PER보다 낮은 Forward PER (이익 성장 기대)"
          caution="현재 PER보다 높은 Forward PER (이익 감소 우려)"
        />

        <MetricCard
          name="PEG (주가수익성장비율)"
          formula="PER ÷ EPS 성장률(%)"
          description="PER에 성장률을 반영한 지표입니다. PEG 1.0이면 이익 성장에 비해 적정 가격, 1.0 미만이면 저평가로 볼 수 있습니다. 높은 PER도 성장률이 충분히 높다면 PEG로 재평가할 수 있습니다."
          good="PEG 1.0 미만 (성장 대비 저평가)"
          caution="PEG 2.0 초과 (성장 대비 고평가)"
        />

        <MetricCard
          name="PBR (주가순자산비율, P/B Ratio)"
          formula="주가 ÷ 주당순자산(BPS)"
          description="기업의 순자산 대비 주가 수준을 나타냅니다. PBR 1.0이면 주가가 장부가치와 같다는 의미입니다. 금융주, 제조업 등 자산 집약적 업종에서 특히 유용한 지표입니다. 무형자산이 많은 IT·플랫폼 기업은 PBR이 높게 형성되는 경향이 있습니다."
          good="PBR 1.0 미만 (장부가치 이하 거래 — 자산 관점 저평가)"
          caution="PBR 지나치게 낮으면 기업 가치 훼손 가능성도 검토 필요"
        />

        <MetricCard
          name="P/S (주가매출비율, Price-to-Sales)"
          formula="시가총액 ÷ 연간 매출"
          description="이익이 없는 성장주를 평가할 때 유용한 지표입니다. 매출 대비 주가 수준을 보여주며, 적자 기업도 평가할 수 있습니다. 업종별 차이가 크므로 동종 업계와 비교가 필수입니다."
          good="업종 평균 대비 낮은 P/S"
          caution="P/S가 지나치게 높으면 수익화 전제가 필수"
        />

        <MetricCard
          name="EV/EBITDA"
          formula="기업가치(EV) ÷ EBITDA"
          description="부채를 포함한 기업 전체 가치를 영업 현금창출력으로 나눈 지표입니다. 자본구조가 다른 기업 간 비교에 유리하며, M&A 가치평가에서 자주 활용됩니다. 감가상각비가 큰 업종(통신, 유틸리티 등)에서 특히 유용합니다."
          good="업종 평균 대비 낮은 EV/EBITDA (저평가)"
          caution="15~20 초과 시 고평가 가능성 (업종마다 다름)"
        />

        <MetricCard
          name="배당수익률 (Dividend Yield)"
          formula="연간 주당배당금 ÷ 주가 × 100"
          description="투자금 대비 배당 수입 비율입니다. 안정적 현금흐름을 원하는 배당 투자자에게 중요한 지표입니다. 단, 배당수익률이 지나치게 높으면 배당 삭감 위험이나 주가 하락이 원인일 수 있어 지속 가능성을 함께 확인해야 합니다."
          good="업종 평균 대비 높고 배당성향이 지속 가능한 수준"
          caution="배당수익률 7% 초과 시 지속 가능성 점검 필요"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">💰 수익성 지표</h2>

        <MetricCard
          name="ROE (자기자본이익률)"
          formula="순이익 ÷ 자기자본 × 100"
          description="주주 자본으로 얼마나 이익을 창출하는지 보여줍니다. 워런 버핏이 가장 중요하게 여기는 지표 중 하나로, 지속적으로 높은 ROE는 강력한 경쟁우위(해자)의 신호입니다. 단, 부채가 많아도 ROE가 높게 나올 수 있으므로 부채비율과 함께 확인하세요."
          good="ROE 15% 이상, 3~5년간 지속 유지"
          caution="부채 증가로 인한 ROE 상승은 위험 신호"
        />

        <MetricCard
          name="ROA (총자산이익률)"
          formula="순이익 ÷ 총자산 × 100"
          description="기업이 보유한 총자산을 얼마나 효율적으로 활용해 이익을 내는지 나타냅니다. ROE와 달리 부채 효과를 배제하므로 자본구조가 다른 기업 간 수익성 비교에 적합합니다."
          good="ROA 5% 이상 (업종 평균 대비)"
          caution="ROA가 낮고 ROE가 높다면 레버리지 과다 사용"
        />

        <MetricCard
          name="영업이익률 (Operating Margin)"
          formula="영업이익 ÷ 매출 × 100"
          description="핵심 사업에서 얼마나 효율적으로 이익을 내는지 보여줍니다. 이자비용·세금 전 단계의 수익성이므로 본업 경쟁력을 잘 반영합니다. 높고 안정적인 영업이익률은 강한 가격 결정력과 비용 통제 능력을 의미합니다."
          good="15% 이상, 업종 내 상위 수준"
          caution="마이너스 영업이익률은 본업 적자"
        />

        <MetricCard
          name="순이익률 (Net Margin)"
          formula="순이익 ÷ 매출 × 100"
          description="모든 비용(영업비용, 이자, 세금)을 차감한 후 남는 최종 이익 비율입니다. 업종마다 기준이 크게 다릅니다. 유통업은 3~5%도 양호하지만, 소프트웨어 기업은 20~30%를 보이기도 합니다."
          good="업종 평균 이상, 지속적으로 안정적"
          caution="일회성 이익으로 인한 순이익률 급등은 지속성 확인 필요"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">📈 성장성 지표</h2>

        <MetricCard
          name="EPS 성장률 (YoY)"
          formula="(올해 EPS - 작년 EPS) ÷ 작년 EPS × 100"
          description="전년 대비 주당순이익 증가율입니다. 매출 성장이 이익 성장으로 이어지는지 확인하는 핵심 지표입니다. 성장주 투자자는 보통 EPS 성장률 20% 이상을 선호합니다."
          good="20% 이상, 성장 가속화 추세"
          caution="EPS 성장이 매출 성장 없이 비용 절감만으로 이루어진 경우"
        />

        <MetricCard
          name="매출 성장률 (YoY)"
          formula="(올해 매출 - 작년 매출) ÷ 작년 매출 × 100"
          description="전년 대비 매출 증가율입니다. 이익 성장의 가장 기초가 되는 지표로, 지속적 매출 성장 없이는 장기 이익 성장도 어렵습니다. 특히 초기 성장주 평가에서 중요합니다."
          good="10~20% 이상 지속 성장"
          caution="매출은 성장하지만 이익이 줄어드는 역레버리지 상황"
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">🏦 재무건전성 지표</h2>

        <MetricCard
          name="부채비율 (D/E Ratio)"
          formula="총부채 ÷ 자기자본 × 100"
          description="기업이 자기자본 대비 얼마나 많은 부채를 사용하는지 나타냅니다. 부채는 레버리지 효과로 수익을 높일 수 있지만, 경기 침체 시 위험을 증폭시킵니다. 업종별 기준이 크게 다릅니다."
          good="100% 미만 (업종 따라 다름)"
          caution="금리 상승기에 고부채 기업은 이자 부담 급증"
        />

        <MetricCard
          name="유동비율 (Current Ratio)"
          formula="유동자산 ÷ 유동부채"
          description="1년 이내 갚아야 할 부채를 1년 이내 현금화 가능한 자산으로 얼마나 커버할 수 있는지 나타냅니다. 단기 지급 능력을 판단하는 지표로, 낮을수록 단기 유동성 위험이 높습니다."
          good="유동비율 2.0 이상 (유동자산이 유동부채의 2배)"
          caution="1.0 미만이면 단기 유동성 위기 가능성"
        />
      </section>

      <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6 mt-8">
        <h2 className="text-white font-semibold mb-2">⚠️ 투자 유의사항</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          본 가이드에 소개된 지표들은 투자 판단을 돕기 위한 참고 자료입니다.
          어떤 단일 지표도 완벽하지 않으며, 여러 지표를 종합적으로 분석하고
          기업의 사업 모델, 산업 환경, 경쟁 구도를 함께 고려해야 합니다.
          투자 결정은 반드시 본인의 판단과 책임하에 이루어져야 하며,
          필요한 경우 전문 금융 자문가와 상담하시기 바랍니다.
        </p>
      </div>
    </article>
  )
}
