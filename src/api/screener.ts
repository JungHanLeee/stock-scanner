import axios from 'axios'
import type { FilterState, ScreenerResponse, Preset, PriceBar } from '../types/stock'

const api = axios.create({ baseURL: '/api' })

const p = (v: string) => (v !== '' ? parseFloat(v) : undefined)

export async function fetchStocks(f: FilterState): Promise<ScreenerResponse> {
  const params: Record<string, string | number> = {
    market: f.market,
    market_type: f.market_type,
    sort_by: f.sort_by,
    sort_order: f.sort_order,
    limit: f.limit,
  }

  const add = (key: string, val: number | undefined, mult = 1) => {
    if (val !== undefined) params[key] = val * mult
  }

  if (f.sector) params.sector = f.sector

  // 기본
  add('min_price',      p(f.min_price))
  add('max_price',      p(f.max_price))
  add('min_market_cap', p(f.min_market_cap), 1e9)
  add('max_market_cap', p(f.max_market_cap), 1e9)
  add('min_volume',     p(f.min_volume), 1000)

  // 가치평가
  add('min_pe',         p(f.min_pe))
  add('max_pe',         p(f.max_pe))
  add('min_fwd_pe',     p(f.min_fwd_pe))
  add('max_fwd_pe',     p(f.max_fwd_pe))
  add('min_peg',        p(f.min_peg))
  add('max_peg',        p(f.max_peg))
  add('min_pbr',        p(f.min_pbr))
  add('max_pbr',        p(f.max_pbr))
  add('min_ps',         p(f.min_ps))
  add('max_ps',         p(f.max_ps))
  add('min_ev_ebitda',  p(f.min_ev_ebitda))
  add('max_ev_ebitda',  p(f.max_ev_ebitda))
  add('min_pocf',       p(f.min_pocf))
  add('max_pocf',       p(f.max_pocf))
  add('min_dividend',   p(f.min_dividend))
  add('max_dividend',   p(f.max_dividend))

  // 재무
  add('min_roe',            p(f.min_roe))
  add('max_roe',            p(f.max_roe))
  add('min_roa',            p(f.min_roa))
  add('max_roa',            p(f.max_roa))
  add('min_roic',           p(f.min_roic))
  add('max_roic',           p(f.max_roic))
  add('min_gross_margin',   p(f.min_gross_margin))
  add('max_gross_margin',   p(f.max_gross_margin))
  add('min_operating_margin', p(f.min_operating_margin))
  add('max_operating_margin', p(f.max_operating_margin))
  add('min_net_margin',     p(f.min_net_margin))
  add('max_net_margin',     p(f.max_net_margin))
  add('min_eps_growth',     p(f.min_eps_growth))
  add('max_eps_growth',     p(f.max_eps_growth))
  add('min_eps_qoq',        p(f.min_eps_qoq))
  add('max_eps_qoq',        p(f.max_eps_qoq))
  add('min_sales_growth',   p(f.min_sales_growth))
  add('max_sales_growth',   p(f.max_sales_growth))
  add('min_current_ratio',  p(f.min_current_ratio))
  add('max_current_ratio',  p(f.max_current_ratio))
  add('min_lt_de',          p(f.min_lt_de))
  add('max_lt_de',          p(f.max_lt_de))
  add('min_de',             p(f.min_de))
  add('max_de',             p(f.max_de))

  // 소유구조
  add('min_insider_own', p(f.min_insider_own))
  add('max_insider_own', p(f.max_insider_own))
  add('min_inst_own',    p(f.min_inst_own))
  add('max_inst_own',    p(f.max_inst_own))

  const res = await api.get<ScreenerResponse>('/screen', { params })
  return res.data
}

export async function fetchSectors(market: string): Promise<{ value: string; label: string }[]> {
  const res = await api.get('/sectors', { params: { market } })
  return res.data
}

export async function fetchPresets(): Promise<{ presets: Preset[] }> {
  const res = await api.get('/presets')
  return res.data
}

export async function fetchStockDetail(ticker: string, market = 'US'): Promise<{
  ticker: string; name: string; description: string
  history: PriceBar[]; info: Record<string, number | null>
}> {
  const res = await api.get(`/stock/${ticker}`, { params: { market } })
  return res.data
}
