import { useState, useCallback, useRef } from 'react'
import type { Stock, FilterState, ScreenerResponse, FilterHistoryEntry } from '../types/stock'
import { fetchStocks } from '../api/screener'

// ── 로컬스토리지 키 ──────────────────────────────────────────────
const LS_KEY = 'stockscreener_history'
const MAX_HISTORY = 15

// ── 필터 요약 레이블 생성 ────────────────────────────────────────
function generateLabel(f: FilterState): string {
  const parts: string[] = []

  const mkt = f.market === 'US' ? '미국' : f.market === 'KR' ? '한국' : '전체'
  parts.push(mkt)

  if (f.sector) parts.push(f.sector)
  if (f.market === 'KR' && f.market_type !== 'ALL') parts.push(f.market_type)

  const rng = (label: string, mn: string, mx: string) => {
    if (!mn && !mx) return
    if (mn && mx)  parts.push(`${label} ${mn}~${mx}`)
    else if (mn)   parts.push(`${label} >${mn}`)
    else           parts.push(`${label} <${mx}`)
  }

  if (f.min_market_cap || f.max_market_cap) rng('시총(B$)', f.min_market_cap, f.max_market_cap)
  if (f.min_pe  || f.max_pe)  rng('PER',  f.min_pe,  f.max_pe)
  if (f.min_fwd_pe || f.max_fwd_pe) rng('선행PER', f.min_fwd_pe, f.max_fwd_pe)
  if (f.min_peg || f.max_peg) rng('PEG',  f.min_peg, f.max_peg)
  if (f.min_pbr || f.max_pbr) rng('PBR',  f.min_pbr, f.max_pbr)
  if (f.min_ps  || f.max_ps)  rng('PSR',  f.min_ps,  f.max_ps)
  if (f.min_pocf|| f.max_pocf)rng('P/CF', f.min_pocf,f.max_pocf)
  if (f.min_ev_ebitda || f.max_ev_ebitda) rng('EV/EBITDA', f.min_ev_ebitda, f.max_ev_ebitda)
  if (f.min_dividend || f.max_dividend) rng('배당', f.min_dividend, f.max_dividend)
  if (f.min_roe || f.max_roe) rng('ROE',  f.min_roe, f.max_roe)
  if (f.min_roa || f.max_roa) rng('ROA',  f.min_roa, f.max_roa)
  if (f.min_operating_margin || f.max_operating_margin) rng('영업이익률', f.min_operating_margin, f.max_operating_margin)
  if (f.min_net_margin || f.max_net_margin) rng('순이익률', f.min_net_margin, f.max_net_margin)
  if (f.min_eps_growth || f.max_eps_growth) rng('EPS성장', f.min_eps_growth, f.max_eps_growth)
  if (f.min_eps_qoq || f.max_eps_qoq) rng('EPSQoQ', f.min_eps_qoq, f.max_eps_qoq)
  if (f.min_sales_growth || f.max_sales_growth) rng('매출성장', f.min_sales_growth, f.max_sales_growth)
  if (f.min_de || f.max_de) rng('부채/자본', f.min_de, f.max_de)
  if (f.min_price || f.max_price) rng('주가', f.min_price, f.max_price)
  if (f.min_volume) parts.push(`거래량 >${f.min_volume}천`)

  return parts.join(' · ') || '전체 종목'
}

// ── 로컬스토리지 헬퍼 ────────────────────────────────────────────
function loadHistory(): FilterHistoryEntry[] {
  if (typeof window === 'undefined') return [] // SSR/prerender 가드
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as FilterHistoryEntry[]) : []
  } catch { return [] }
}

function saveHistory(entries: FilterHistoryEntry[]): void {
  if (typeof window === 'undefined') return // SSR/prerender 가드
  try { localStorage.setItem(LS_KEY, JSON.stringify(entries)) } catch { /* 무시 */ }
}

export const DEFAULT_FILTERS: FilterState = {
  market: 'US',
  market_type: 'ALL',
  sector: '',
  min_price: '', max_price: '',
  min_market_cap: '', max_market_cap: '',
  min_volume: '',
  min_pe: '', max_pe: '',
  min_fwd_pe: '', max_fwd_pe: '',
  min_peg: '', max_peg: '',
  min_pbr: '', max_pbr: '',
  min_ps: '', max_ps: '',
  min_ev_ebitda: '', max_ev_ebitda: '',
  min_pocf: '', max_pocf: '',
  min_dividend: '', max_dividend: '',
  min_roe: '', max_roe: '',
  min_roa: '', max_roa: '',
  min_roic: '', max_roic: '',
  min_gross_margin: '', max_gross_margin: '',
  min_operating_margin: '', max_operating_margin: '',
  min_net_margin: '', max_net_margin: '',
  min_eps_growth: '', max_eps_growth: '',
  min_eps_qoq: '', max_eps_qoq: '',
  min_sales_growth: '', max_sales_growth: '',
  min_current_ratio: '', max_current_ratio: '',
  min_lt_de: '', max_lt_de: '',
  min_de: '', max_de: '',
  min_insider_own: '', max_insider_own: '',
  min_inst_own: '', max_inst_own: '',
  sort_by: 'marketcap',
  sort_order: 'desc',
  limit: 250,  // 항상 최대 요청 → 프론트 페이지네이션으로 분할
}

export function useScreener() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [filterHistory, setFilterHistory] = useState<FilterHistoryEntry[]>(loadHistory)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (newFilters?: FilterState) => {
    const f = newFilters ?? filters
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setError(null)
    try {
      const data: ScreenerResponse = await fetchStocks(f)
      setStocks(data.stocks)
      setTotal(data.total)

      // ── 검색 기록 저장 ──────────────────────────────────────────
      const entry: FilterHistoryEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        label: generateLabel(f),
        filters: { ...f },
      }
      setFilterHistory(prev => {
        // 동일한 레이블이 이미 있으면 맨 앞으로 이동 (중복 제거)
        const deduped = prev.filter(e => e.label !== entry.label)
        const next = [entry, ...deduped].slice(0, MAX_HISTORY)
        saveHistory(next)
        return next
      })
    } catch (e: unknown) {
      if ((e as { name?: string }).name !== 'CanceledError') {
        setError('데이터를 불러오는 데 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((partial: Partial<FilterState>) => {
    setFilters(prev => {
      const next = { ...prev, ...partial }
      if (partial.market !== undefined) {
        if (partial.market === 'US') next.market_type = 'ALL'
        else if (partial.market === 'KR') next.market_type = 'KOSPI'
        else next.market_type = 'ALL'
      }
      return next
    })
  }, [])

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), [])

  /** 기록에서 필터 불러오기 */
  const loadFromHistory = useCallback((entry: FilterHistoryEntry) => {
    setFilters(entry.filters)
  }, [])

  /** 기록 항목 삭제 */
  const deleteHistory = useCallback((id: string) => {
    setFilterHistory(prev => {
      const next = prev.filter(e => e.id !== id)
      saveHistory(next)
      return next
    })
  }, [])

  /** 기록 전체 삭제 */
  const clearHistory = useCallback(() => {
    setFilterHistory([])
    saveHistory([])
  }, [])

  return {
    stocks, total, loading, error, filters,
    updateFilters, resetFilters, search,
    filterHistory, loadFromHistory, deleteHistory, clearHistory,
  }
}
