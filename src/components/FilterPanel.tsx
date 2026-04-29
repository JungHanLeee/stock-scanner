import React, { useEffect, useState, useRef } from 'react'
import { RotateCcw, Search, Zap, Info, History, X, Trash2 } from 'lucide-react'
import type { FilterState, Preset, FilterHistoryEntry } from '../types/stock'
import { fetchSectors, fetchPresets } from '../api/screener'

interface FilterPanelProps {
  filters: FilterState
  onChange: (partial: Partial<FilterState>) => void
  onSearch: () => void
  onReset: () => void
  filterHistory: FilterHistoryEntry[]
  onLoadHistory: (entry: FilterHistoryEntry) => void
  onDeleteHistory: (id: string) => void
  onClearHistory: () => void
}

// ── 드롭다운 옵션 정의 ──────────────────────────────────────────
// value 형식: "" = 전체, "min-max" = 범위, "min-" = min 이상, "-max" = max 이하
interface Opt { label: string; value: string }

const any: Opt = { label: '전체', value: '' }

const PE_OPTS: Opt[] = [
  any,
  { label: '흑자 (0~30)', value: '0-30' },
  { label: '저PER (<15)', value: '-15' },
  { label: '25 미만', value: '-25' },
  { label: '50 미만', value: '-50' },
  { label: '고성장 (>50)', value: '50-' },
]
const FWD_PE_OPTS: Opt[] = [
  any,
  { label: '저평가 (<15)', value: '-15' },
  { label: '적정 (<25)', value: '-25' },
  { label: '성장 (<50)', value: '-50' },
]
const PEG_OPTS: Opt[] = [
  any,
  { label: '저평가 (<1)', value: '-1' },
  { label: '적정 (<2)', value: '-2' },
  { label: '고성장 (<3)', value: '-3' },
]
const PB_OPTS: Opt[] = [
  any,
  { label: '저평가 (<1)', value: '-1' },
  { label: '적정 (<3)', value: '-3' },
  { label: '5 미만', value: '-5' },
  { label: '10 미만', value: '-10' },
]
const PS_OPTS: Opt[] = [
  any,
  { label: '1 미만', value: '-1' },
  { label: '3 미만', value: '-3' },
  { label: '5 미만', value: '-5' },
  { label: '10 미만', value: '-10' },
]
const EV_EBITDA_OPTS: Opt[] = [
  any,
  { label: '저평가 (<5)', value: '-5' },
  { label: '10 미만', value: '-10' },
  { label: '15 미만', value: '-15' },
  { label: '25 미만', value: '-25' },
]
const POCF_OPTS: Opt[] = [
  any,
  { label: '저평가 (<10)', value: '-10' },
  { label: '15 미만', value: '-15' },
  { label: '20 미만', value: '-20' },
  { label: '30 미만', value: '-30' },
  { label: '고평가 (>50)', value: '50-' },
]
const EPS_QOQ_OPTS: Opt[] = [
  any,
  { label: '성장 (>0%)', value: '0-' },
  { label: '양호 (>10%)', value: '10-' },
  { label: '우수 (>25%)', value: '25-' },
  { label: '탁월 (>50%)', value: '50-' },
  { label: '감소 (<0%)', value: '-0' },
]
const DIV_OPTS: Opt[] = [
  any,
  { label: '배당 있음 (>0)', value: '0-' },
  { label: '고배당 (>3%)', value: '3-' },
  { label: '초고배당 (>5%)', value: '5-' },
]
const ROE_OPTS: Opt[] = [
  any,
  { label: '양호 (>10%)', value: '10-' },
  { label: '우수 (>15%)', value: '15-' },
  { label: '탁월 (>30%)', value: '30-' },
  { label: '부진 (<0)', value: '-0' },
]
const ROA_OPTS: Opt[] = [
  any,
  { label: '양호 (>5%)', value: '5-' },
  { label: '우수 (>10%)', value: '10-' },
  { label: '탁월 (>15%)', value: '15-' },
]
const MARGIN_OPTS: Opt[] = [
  any,
  { label: '양호 (>10%)', value: '10-' },
  { label: '우수 (>20%)', value: '20-' },
  { label: '탁월 (>30%)', value: '30-' },
  { label: '부진 (<0)', value: '-0' },
]
const GROSS_MARGIN_OPTS: Opt[] = [
  any,
  { label: '30% 이상', value: '30-' },
  { label: '50% 이상', value: '50-' },
  { label: '70% 이상', value: '70-' },
]
const GROWTH_OPTS: Opt[] = [
  any,
  { label: '양호 (>10%)', value: '10-' },
  { label: '우수 (>25%)', value: '25-' },
  { label: '감소 (<0)', value: '-0' },
  { label: '25% 미만', value: '-25' },
]
const CR_OPTS: Opt[] = [
  any,
  { label: '안전 (>1)', value: '1-' },
  { label: '우수 (>2)', value: '2-' },
  { label: '위험 (<1)', value: '-1' },
]
const DE_OPTS: Opt[] = [
  any,
  { label: '무부채 (<0.1)', value: '-0.1' },
  { label: '낮음 (<0.5)', value: '-0.5' },
  { label: '적정 (<1)', value: '-1' },
  { label: '높음 (>1)', value: '1-' },
]
const OWN_OPTS: Opt[] = [
  any,
  { label: '5% 이상', value: '5-' },
  { label: '10% 이상', value: '10-' },
  { label: '30% 이상', value: '30-' },
  { label: '50% 이상', value: '50-' },
]
const MCAP_OPTS: Opt[] = [
  any,
  { label: '소형 (>0.3B)', value: '0.3-' },
  { label: '중형 (>1B)', value: '1-' },
  { label: '대형 (>10B)', value: '10-' },
  { label: '초대형 (>100B)', value: '100-' },
]

// ── 유틸 ───────────────────────────────────────────────────────
function parseOpt(value: string): { min: string; max: string } {
  if (!value) return { min: '', max: '' }
  if (value.startsWith('-')) return { min: '', max: value.slice(1) }
  if (value.endsWith('-')) return { min: value.slice(0, -1), max: '' }
  const [min, max] = value.split('-')
  return { min, max }
}

function encodeOpt(minKey: keyof FilterState, maxKey: keyof FilterState, filters: FilterState): string {
  const min = filters[minKey] as string
  const max = filters[maxKey] as string
  if (!min && !max) return ''
  if (!min) return `-${max}`
  if (!max) return `${min}-`
  return `${min}-${max}`
}

// ── 필터 설명 ─────────────────────────────────────────────────
const FILTER_DESC: Record<string, string> = {
  'P/E':        '주가수익비율 (Price/Earnings). 현재 주가를 주당순이익(EPS)으로 나눈 값. 낮을수록 저평가, 높을수록 성장 기대가 크다는 의미입니다.',
  'Forward P/E':'선행 PER. 미래 예상 EPS 기준 PER. 현재 PER보다 낮으면 이익 성장이 기대된다는 신호입니다.',
  'PEG':        'PEG비율 (Price/Earnings to Growth). PER을 EPS 성장률로 나눈 값. 1 미만이면 성장 대비 저평가로 해석합니다.',
  'P/B':        '주가순자산비율 (Price/Book). 현재 주가를 주당순자산으로 나눈 값. 1 미만이면 자산 대비 저평가입니다.',
  'P/S':        '주가매출비율 (Price/Sales). 시가총액을 연간 매출로 나눈 값. 이익이 없는 성장주 평가에 자주 사용합니다.',
  'EV/EBITDA':  '기업가치(EV)를 세전·이자·감가상각 전 이익(EBITDA)으로 나눈 값. 부채를 포함한 기업가치 평가 지표로 낮을수록 저평가입니다.',
  'P/CF':       '주가를 주당 잉여현금흐름(FCF)으로 나눈 값. 회계 이익보다 현금 창출 능력을 직접 반영하며, 낮을수록 현금흐름 대비 저평가를 의미합니다.',
  '배당수익률': '연간 배당금을 현재 주가로 나눈 비율(%). 높을수록 현금 수익이 크지만, 지속 가능성도 함께 확인해야 합니다.',
  'ROE':        '자기자본이익률 (Return on Equity). 당기순이익 ÷ 자기자본. 주주 투자금 대비 얼마나 이익을 냈는지를 나타냅니다. 15% 이상이 우수합니다.',
  'ROA':        '총자산이익률 (Return on Assets). 당기순이익 ÷ 총자산. 보유 자산으로 얼마나 효율적으로 이익을 냈는지를 나타냅니다.',
  'ROIC':       '투하자본이익률 (Return on Invested Capital). 영업이익 ÷ 투하자본. 실제 사업에 투입된 자본 대비 효율성을 측정합니다.',
  '매출총이익률': '(매출 - 매출원가) ÷ 매출. 제품·서비스의 원가 경쟁력을 나타냅니다. 소프트웨어·플랫폼은 60% 이상이 일반적입니다.',
  '영업이익률': '영업이익 ÷ 매출. 판관비를 포함한 실질 사업 수익성 지표입니다. 높을수록 비용 통제 능력이 우수합니다.',
  '순이익률':   '당기순이익 ÷ 매출. 세금·이자·감가상각까지 모두 반영한 최종 수익성입니다.',
  'EPS 성장':   '주당순이익(EPS) 전년 대비 성장률(%). 기업의 이익 성장 속도를 나타냅니다.',
  'EPS QoQ':    '분기별 EPS 전년동기 대비 성장률(%). 같은 분기와 비교해 최근 실적 개선 속도를 나타냅니다.',
  '매출 성장':  '전년 대비 매출 성장률(%). 이익보다 먼저 나타나는 성장 선행 지표입니다.',
  '유동비율':   '유동자산 ÷ 유동부채. 1년 내 갚아야 할 부채 대비 단기 자산 비율. 1 이상이면 단기 안전성이 양호합니다.',
  '장기부채/자본': '장기부채 ÷ 자기자본. 장기 레버리지 수준을 나타냅니다. 낮을수록 재무 안정성이 높습니다.',
  '부채/자본':  '총부채 ÷ 자기자본. 전체 레버리지 수준. 업종마다 다르지만 일반적으로 1 이하가 보수적입니다.',
  '내부자 보유': '경영진·이사회 등 내부자의 지분율(%). 높을수록 경영진과 주주의 이해관계가 일치합니다.',
  '기관 보유':  '펀드·연기금 등 기관투자자의 지분율(%). 높으면 전문 투자자의 관심이 크다는 신호입니다.',
  '시가총액 (B$)': '기업의 전체 시장가치 (단위: 십억 달러). 소형주 < 2B < 중형주 < 10B < 대형주 < 200B < 초대형주.',
  '주가 범위':  '현재 주가의 최소·최대 범위 필터.',
  '거래량 (천주 최소)': '3개월 평균 일일 거래량 기준. 유동성이 낮은 종목을 제외할 때 사용합니다.',
  '섹터':       '기업이 속한 산업 섹터. 동일 섹터 내 비교 분석에 활용합니다.',
  '거래소 (KR)': '한국 주식시장 구분. KOSPI는 대형 우량주, KOSDAQ은 중소형·기술주 중심입니다.',
}

// ── InfoTooltip ───────────────────────────────────────────────
const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-gray-600 hover:text-blue-400 transition-colors ml-1 align-middle"
        tabIndex={-1}
      >
        <Info className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-5 z-50 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-2.5">
          <p className="text-gray-200 text-xs leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  )
}

// ── 재사용 컴포넌트 ────────────────────────────────────────────
interface FDropProps {
  label: string
  opts: Opt[]
  minKey: keyof FilterState
  maxKey: keyof FilterState
  filters: FilterState
  onChange: (p: Partial<FilterState>) => void
}

const FDrop: React.FC<FDropProps> = ({ label, opts, minKey, maxKey, filters, onChange }) => {
  const current = encodeOpt(minKey, maxKey, filters)
  const desc = FILTER_DESC[label]
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-gray-500 text-xs flex items-center">
        {label}
        {desc && <InfoTooltip text={desc} />}
      </label>
      <select
        value={current}
        onChange={e => {
          const { min, max } = parseOpt(e.target.value)
          onChange({ [minKey]: min, [maxKey]: max } as Partial<FilterState>)
        }}
        className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-gray-700 focus:border-blue-400 focus:outline-none"
      >
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ── 탭 정의 ───────────────────────────────────────────────────
type Tab = '기본' | '가치평가' | '재무' | '소유구조'
const TABS: Tab[] = ['기본', '가치평가', '재무', '소유구조']

// ── 메인 컴포넌트 ──────────────────────────────────────────────
// ── 시간 포맷 ─────────────────────────────────────────────────
function fmtTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters, onChange, onSearch, onReset,
  filterHistory, onLoadHistory, onDeleteHistory, onClearHistory,
}) => {
  const [sectors, setSectors] = useState<{ value: string; label: string }[]>([])
  const [presets, setPresets] = useState<Preset[]>([])
  const [tab, setTab] = useState<Tab>('기본')
  const [historyOpen, setHistoryOpen] = useState(false)

  useEffect(() => {
    fetchSectors(filters.market !== 'ALL' ? filters.market : 'US').then(setSectors).catch(() => {})
    fetchPresets().then(d => setPresets(d.presets)).catch(() => {})
  }, [filters.market])

  const applyPreset = (p: Preset) => {
    const patch: Partial<FilterState> = {
      market: p.market as 'US' | 'KR' | 'ALL',
      min_pe: '', max_pe: '', min_market_cap: '', min_dividend: '', sector: '',
    }
    const pm = p.params
    if (pm.market_type) patch.market_type = pm.market_type as 'KOSPI' | 'KOSDAQ' | 'ALL'
    if (pm.sector)       patch.sector = String(pm.sector)
    if (pm.min_pe)       patch.min_pe = String(pm.min_pe)
    if (pm.max_pe)       patch.max_pe = String(pm.max_pe)
    if (pm.min_dividend) patch.min_dividend = String(pm.min_dividend)
    if (pm.min_market_cap) patch.min_market_cap = String(Number(pm.min_market_cap) / 1e9)
    onChange(patch)
  }

  return (
    <aside className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4 py-2">

        {/* 상단: 탭 + 프리셋 + 버튼 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  tab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onReset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700">
              <RotateCcw className="w-3 h-3" /> 초기화
            </button>
            <button onClick={onSearch} className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded font-medium">
              <Search className="w-3 h-3" /> 검색
            </button>
          </div>
        </div>

        {/* 프리셋 + 검색 기록 */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="flex items-center gap-1 text-xs text-gray-600 mr-1">
            <Zap className="w-3 h-3" />
          </span>
          {presets.map(p => (
            <button key={p.id} onClick={() => applyPreset(p)}
              className="text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors">
              {p.name}
            </button>
          ))}

          {/* 검색 기록 버튼 */}
          {filterHistory.length > 0 && (
            <div className="relative ml-auto">
              <button
                onClick={() => setHistoryOpen(o => !o)}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors ${
                  historyOpen
                    ? 'border-blue-500 text-blue-400 bg-blue-950'
                    : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                <History className="w-3 h-3" />
                최근 검색 {filterHistory.length}
              </button>

              {historyOpen && (
                <div className="absolute right-0 top-7 z-50 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
                    <span className="text-xs font-medium text-gray-300">검색 기록</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onClearHistory}
                        className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-0.5 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> 전체 삭제
                      </button>
                      <button onClick={() => setHistoryOpen(false)} className="text-gray-500 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 기록 목록 */}
                  <ul className="max-h-64 overflow-y-auto divide-y divide-gray-700">
                    {filterHistory.map(entry => (
                      <li key={entry.id} className="flex items-start gap-2 px-3 py-2 hover:bg-gray-750 group transition-colors"
                          style={{ backgroundColor: 'transparent' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <button
                          className="flex-1 text-left min-w-0"
                          onClick={() => { onLoadHistory(entry); setHistoryOpen(false) }}
                        >
                          <p className="text-xs text-gray-200 truncate">{entry.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{fmtTime(entry.timestamp)}</p>
                        </button>
                        <button
                          onClick={() => onDeleteHistory(entry.id)}
                          className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mt-0.5 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 탭별 필터 */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-2">

          {/* ── 기본 ── */}
          {tab === '기본' && (<>
            {filters.market !== 'US' && (
            <div className="flex flex-col gap-0.5">
              <label className="text-gray-500 text-xs flex items-center">
                거래소 (KR)
                {FILTER_DESC['거래소 (KR)'] && <InfoTooltip text={FILTER_DESC['거래소 (KR)']} />}
              </label>
              <select value={filters.market_type}
                onChange={e => onChange({ market_type: e.target.value as 'KOSPI'|'KOSDAQ'|'ALL' })}
                className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-gray-700 focus:border-blue-400 focus:outline-none">
                <option value="ALL">전체</option>
                <option value="KOSPI">KOSPI</option>
                <option value="KOSDAQ">KOSDAQ</option>
              </select>
            </div>
            )}

            <div className="flex flex-col gap-0.5">
              <label className="text-gray-500 text-xs flex items-center">
                섹터
                {FILTER_DESC['섹터'] && <InfoTooltip text={FILTER_DESC['섹터']} />}
              </label>
              <select value={filters.sector}
                onChange={e => onChange({ sector: e.target.value })}
                className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-gray-700 focus:border-blue-400 focus:outline-none">
                <option value="">전체</option>
                {sectors.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <FDrop label="시가총액 (B$)" opts={MCAP_OPTS} minKey="min_market_cap" maxKey="max_market_cap" filters={filters} onChange={onChange} />

            <div className="flex flex-col gap-0.5 col-span-2">
              <label className="text-gray-500 text-xs flex items-center">
                주가 범위
                {FILTER_DESC['주가 범위'] && <InfoTooltip text={FILTER_DESC['주가 범위']} />}
              </label>
              <div className="flex gap-1">
                <input type="number" placeholder="최소" value={filters.min_price}
                  onChange={e => onChange({ min_price: e.target.value })}
                  className="w-full bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-gray-700 focus:border-blue-400 focus:outline-none" />
                <input type="number" placeholder="최대" value={filters.max_price}
                  onChange={e => onChange({ max_price: e.target.value })}
                  className="w-full bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-gray-700 focus:border-blue-400 focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-gray-500 text-xs flex items-center">
                거래량 (천주 최소)
                {FILTER_DESC['거래량 (천주 최소)'] && <InfoTooltip text={FILTER_DESC['거래량 (천주 최소)']} />}
              </label>
              <input type="number" placeholder="예: 500" value={filters.min_volume}
                onChange={e => onChange({ min_volume: e.target.value })}
                className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-gray-700 focus:border-blue-400 focus:outline-none" />
            </div>
          </>)}

          {/* ── 가치평가 ── */}
          {tab === '가치평가' && (<>
            <FDrop label="P/E" opts={PE_OPTS} minKey="min_pe" maxKey="max_pe" filters={filters} onChange={onChange} />
            <FDrop label="Forward P/E" opts={FWD_PE_OPTS} minKey="min_fwd_pe" maxKey="max_fwd_pe" filters={filters} onChange={onChange} />
            <FDrop label="PEG" opts={PEG_OPTS} minKey="min_peg" maxKey="max_peg" filters={filters} onChange={onChange} />
            <FDrop label="P/B" opts={PB_OPTS} minKey="min_pbr" maxKey="max_pbr" filters={filters} onChange={onChange} />
            <FDrop label="P/S" opts={PS_OPTS} minKey="min_ps" maxKey="max_ps" filters={filters} onChange={onChange} />
            <FDrop label="EV/EBITDA" opts={EV_EBITDA_OPTS} minKey="min_ev_ebitda" maxKey="max_ev_ebitda" filters={filters} onChange={onChange} />
            <FDrop label="P/CF" opts={POCF_OPTS} minKey="min_pocf" maxKey="max_pocf" filters={filters} onChange={onChange} />
            <FDrop label="배당수익률" opts={DIV_OPTS} minKey="min_dividend" maxKey="max_dividend" filters={filters} onChange={onChange} />
          </>)}

          {/* ── 재무 ── */}
          {tab === '재무' && (<>
            <FDrop label="ROE" opts={ROE_OPTS} minKey="min_roe" maxKey="max_roe" filters={filters} onChange={onChange} />
            <FDrop label="ROA" opts={ROA_OPTS} minKey="min_roa" maxKey="max_roa" filters={filters} onChange={onChange} />
            <FDrop label="ROIC" opts={ROA_OPTS} minKey="min_roic" maxKey="max_roic" filters={filters} onChange={onChange} />
            <FDrop label="매출총이익률" opts={GROSS_MARGIN_OPTS} minKey="min_gross_margin" maxKey="max_gross_margin" filters={filters} onChange={onChange} />
            <FDrop label="영업이익률" opts={MARGIN_OPTS} minKey="min_operating_margin" maxKey="max_operating_margin" filters={filters} onChange={onChange} />
            <FDrop label="순이익률" opts={MARGIN_OPTS} minKey="min_net_margin" maxKey="max_net_margin" filters={filters} onChange={onChange} />
            <FDrop label="EPS 성장" opts={GROWTH_OPTS} minKey="min_eps_growth" maxKey="max_eps_growth" filters={filters} onChange={onChange} />
            <FDrop label="EPS QoQ" opts={EPS_QOQ_OPTS} minKey="min_eps_qoq" maxKey="max_eps_qoq" filters={filters} onChange={onChange} />
            <FDrop label="매출 성장" opts={GROWTH_OPTS} minKey="min_sales_growth" maxKey="max_sales_growth" filters={filters} onChange={onChange} />
            <FDrop label="유동비율" opts={CR_OPTS} minKey="min_current_ratio" maxKey="max_current_ratio" filters={filters} onChange={onChange} />
            <FDrop label="장기부채/자본" opts={DE_OPTS} minKey="min_lt_de" maxKey="max_lt_de" filters={filters} onChange={onChange} />
            <FDrop label="부채/자본" opts={DE_OPTS} minKey="min_de" maxKey="max_de" filters={filters} onChange={onChange} />
          </>)}

          {/* ── 소유구조 ── */}
          {tab === '소유구조' && (<>
            <FDrop label="내부자 보유" opts={OWN_OPTS} minKey="min_insider_own" maxKey="max_insider_own" filters={filters} onChange={onChange} />
            <FDrop label="기관 보유" opts={OWN_OPTS} minKey="min_inst_own" maxKey="max_inst_own" filters={filters} onChange={onChange} />
          </>)}

        </div>
      </div>
    </aside>
  )
}
