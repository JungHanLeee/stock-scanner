export interface Stock {
  ticker: string
  name: string
  market: 'US' | 'KR'
  exchange: string
  sector: string
  sector_kr: string
  industry: string
  price: number | null
  market_cap: number | null
  market_cap_str: string
  pe_ratio: number | null
  forward_pe: number | null
  peg_ratio: number | null
  pb_ratio: number | null
  ps_ratio: number | null
  ev_ebitda: number | null
  price_to_ocf: number | null
  eps: number | null
  eps_fwd: number | null
  eps_growth: number | null
  eps_growth_qoq: number | null
  sales_growth: number | null
  dividend_yield: number | null
  dividend_growth_years: number | null
  volume: number | null
  avg_volume: number | null
  beta: number | null
  roa: number | null
  roe: number | null
  roic: number | null
  gross_margin: number | null
  operating_margin: number | null
  net_margin: number | null
  current_ratio: number | null
  quick_ratio: number | null
  lt_debt_equity: number | null
  debt_equity: number | null
  insider_own: number | null
  inst_own: number | null
  week52_high: number | null
  week52_low: number | null
  price_from_52h: number | null
  change_pct: number | null
  currency: 'USD' | 'KRW'
  country: string
}

export interface ScreenerResponse {
  total: number
  market: string
  stocks: Stock[]
}

export interface FilterState {
  market: 'US' | 'KR' | 'ALL'
  market_type: 'KOSPI' | 'KOSDAQ' | 'ALL'
  sector: string
  // 기본
  min_price: string
  max_price: string
  min_market_cap: string
  max_market_cap: string
  min_volume: string
  // 가치평가
  min_pe: string
  max_pe: string
  min_fwd_pe: string
  max_fwd_pe: string
  min_peg: string
  max_peg: string
  min_pbr: string
  max_pbr: string
  min_ps: string
  max_ps: string
  min_ev_ebitda: string
  max_ev_ebitda: string
  min_pocf: string
  max_pocf: string
  min_dividend: string
  max_dividend: string
  // 재무
  min_roe: string
  max_roe: string
  min_roa: string
  max_roa: string
  min_roic: string
  max_roic: string
  min_gross_margin: string
  max_gross_margin: string
  min_operating_margin: string
  max_operating_margin: string
  min_net_margin: string
  max_net_margin: string
  min_eps_growth: string
  max_eps_growth: string
  min_eps_qoq: string
  max_eps_qoq: string
  min_sales_growth: string
  max_sales_growth: string
  min_current_ratio: string
  max_current_ratio: string
  min_lt_de: string
  max_lt_de: string
  min_de: string
  max_de: string
  // 소유구조
  min_insider_own: string
  max_insider_own: string
  min_inst_own: string
  max_inst_own: string
  // 정렬
  sort_by: string
  sort_order: 'asc' | 'desc'
  limit: number
}

export interface FilterHistoryEntry {
  id: string
  timestamp: number   // Date.now()
  label: string       // 자동 생성 요약 레이블
  filters: FilterState
}

export interface Preset {
  id: string
  name: string
  market: string
  params: Record<string, string | number>
}

export type ViewTab = 'overview' | 'valuation' | 'financial' | 'performance'

export interface PriceBar {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}
