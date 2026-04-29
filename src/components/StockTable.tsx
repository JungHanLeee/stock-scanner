import React, { useState, useMemo, useEffect } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Stock, ViewTab } from '../types/stock'

interface StockTableProps {
  stocks: Stock[]
  loading: boolean
  error: string | null
  onSelectStock: (ticker: string, market: string) => void
}

type SortKey = keyof Stock
type SortDir = 'desc' | 'asc' | null
interface SortState { key: SortKey | null; dir: SortDir }

const fmt = (v: number | null | undefined, decimals = 2, suffix = '') =>
  v == null ? <span className="text-gray-600">-</span> : (
    <span>{v.toFixed(decimals)}{suffix}</span>
  )

const fmtPrice = (v: number | null, currency: string) => {
  if (v == null) return <span className="text-gray-600">-</span>
  if (currency === 'KRW') return <span>{v.toLocaleString('ko-KR')}원</span>
  return <span>${v.toFixed(2)}</span>
}

const fmtPct = (v: number | null) => {
  if (v == null) return <span className="text-gray-600">-</span>
  const cls = v > 0 ? 'text-green-400' : v < 0 ? 'text-red-400' : 'text-gray-400'
  return <span className={cls}>{v > 0 ? '+' : ''}{v.toFixed(2)}%</span>
}

const TAB_COLUMNS: Record<ViewTab, { key: keyof Stock; label: string; align?: string }[]> = {
  overview: [
    { key: 'ticker', label: '티커' },
    { key: 'name', label: '종목명' },
    { key: 'exchange', label: '거래소' },
    { key: 'sector_kr', label: '섹터' },
    { key: 'price', label: '현재가' },
    { key: 'change_pct', label: '등락률' },
    { key: 'market_cap_str', label: '시가총액' },
    { key: 'volume', label: '거래량' },
    { key: 'pe_ratio', label: 'PER' },
    { key: 'dividend_yield', label: '배당' },
  ],
  valuation: [
    { key: 'ticker', label: '티커' },
    { key: 'name', label: '종목명' },
    { key: 'price', label: '현재가' },
    { key: 'market_cap_str', label: '시가총액' },
    { key: 'pe_ratio', label: 'PER' },
    { key: 'forward_pe', label: '선행PER' },
    { key: 'peg_ratio', label: 'PEG' },
    { key: 'pb_ratio', label: 'PBR' },
    { key: 'ps_ratio', label: 'PSR' },
    { key: 'ev_ebitda', label: 'EV/EBITDA' },
    { key: 'price_to_ocf', label: 'P/CF' },
    { key: 'dividend_yield', label: '배당' },
  ],
  financial: [
    { key: 'ticker', label: '티커' },
    { key: 'name', label: '종목명' },
    { key: 'roe', label: 'ROE' },
    { key: 'roa', label: 'ROA' },
    { key: 'gross_margin', label: '매출총이익률' },
    { key: 'operating_margin', label: '영업이익률' },
    { key: 'net_margin', label: '순이익률' },
    { key: 'eps_growth', label: 'EPS성장(YoY)' },
    { key: 'eps_growth_qoq', label: 'EPS성장(QoQ)' },
    { key: 'sales_growth', label: '매출성장' },
    { key: 'current_ratio', label: '유동비율' },
    { key: 'debt_equity', label: '부채/자본' },
  ],
  performance: [
    { key: 'ticker', label: '티커' },
    { key: 'name', label: '종목명' },
    { key: 'price', label: '현재가' },
    { key: 'change_pct', label: '등락률' },
    { key: 'week52_high', label: '52주 고점' },
    { key: 'week52_low', label: '52주 저점' },
    { key: 'price_from_52h', label: '고점대비' },
    { key: 'beta', label: '베타' },
    { key: 'volume', label: '거래량' },
  ],
}

const TABS: { key: ViewTab; label: string }[] = [
  { key: 'overview', label: '개요' },
  { key: 'valuation', label: '가치평가' },
  { key: 'financial', label: '재무' },
  { key: 'performance', label: '수익률' },
]

function renderCell(col: keyof Stock, stock: Stock): React.ReactNode {
  const v = stock[col]
  switch (col) {
    case 'ticker':
      return (
        <span className="font-mono font-semibold text-blue-400">
          {stock.ticker}
        </span>
      )
    case 'name':
      return <span className="text-gray-200 truncate max-w-[160px] block" title={stock.name}>{stock.name}</span>
    case 'exchange':
      return (
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
          stock.exchange?.includes('KOS') ? 'bg-orange-900 text-orange-300' : 'bg-blue-900 text-blue-300'
        }`}>
          {stock.exchange}
        </span>
      )
    case 'sector_kr':
      return <span className="text-gray-400 text-xs">{v as string || '-'}</span>
    case 'price':
      return fmtPrice(stock.price, stock.currency)
    case 'change_pct':
      return fmtPct(stock.change_pct)
    case 'market_cap_str':
      return <span className="text-gray-200">{stock.market_cap_str}</span>
    case 'volume':
    case 'avg_volume':
      return v == null
        ? <span className="text-gray-600">-</span>
        : <span>{Number(v).toLocaleString()}</span>
    case 'pe_ratio':
    case 'forward_pe':
      return fmt(v as number | null, 1)
    case 'pb_ratio':
    case 'ps_ratio':
      return fmt(v as number | null, 2)
    case 'eps':
    case 'eps_fwd':
      return fmt(v as number | null, 2)
    case 'eps_growth':
    case 'eps_growth_qoq':
    case 'sales_growth':
    case 'roe':
    case 'roa':
    case 'roic':
    case 'gross_margin':
    case 'operating_margin':
    case 'net_margin':
      return fmtPct(v as number | null)
    case 'peg_ratio':
    case 'ev_ebitda':
    case 'price_to_ocf':
      return fmt(v as number | null, 1)
    case 'current_ratio':
    case 'debt_equity':
    case 'lt_debt_equity':
      return fmt(v as number | null, 2)
    case 'dividend_yield':
      return v == null
        ? <span className="text-gray-600">-</span>
        : <span className="text-yellow-400">{(v as number).toFixed(2)}%</span>
    case 'beta':
      return fmt(v as number | null, 2)
    case 'week52_high':
    case 'week52_low':
      return fmtPrice(v as number | null, stock.currency)
    case 'price_from_52h':
      return fmtPct(v as number | null)
    default:
      return <span className="text-gray-400">{String(v ?? '-')}</span>
  }
}

function SortIcon({ col, sort }: { col: keyof Stock; sort: SortState }) {
  if (sort.key !== col || sort.dir === null)
    return <ChevronsUpDown className="w-3 h-3 text-gray-600 inline ml-0.5" />
  return sort.dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-blue-400 inline ml-0.5" />
    : <ChevronDown className="w-3 h-3 text-blue-400 inline ml-0.5" />
}

const PAGE_SIZE_OPTIONS = [25, 50, 100]

export const StockTable: React.FC<StockTableProps> = ({ stocks, loading, error, onSelectStock }) => {
  const [tab, setTab] = useState<ViewTab>('overview')
  const [sort, setSort] = useState<SortState>({ key: 'market_cap', dir: 'desc' })
  const DEFAULT_SORT: SortState = { key: 'market_cap', dir: 'desc' }
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const columns = TAB_COLUMNS[tab]

  const sorted = useMemo(() => {
    if (!sort.key || sort.dir === null) return [...stocks]  // 초기화 시 원본 순서
    return [...stocks].sort((a, b) => {
      const av = a[sort.key!]
      const bv = b[sort.key!]
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = typeof av === 'string'
        ? av.localeCompare(bv as string)
        : (av as number) - (bv as number)
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [stocks, sort])

  // stocks 바뀌면 1페이지로 리셋
  useEffect(() => { setPage(1) }, [stocks])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)
  const startIdx  = (page - 1) * pageSize  // 순번 오프셋

  const handleSort = (key: keyof Stock) => {
    setSort(s => {
      if (s.key !== key)          return { key, dir: 'desc' }  // 새 컬럼 → 내림
      if (s.dir === 'desc')       return { key, dir: 'asc' }   // 2번째 → 오름
      return DEFAULT_SORT                                        // 3번째 → 초기화
    })
    setPage(1)
  }

  // 페이지 번호 목록 생성 (최대 7개: 1 … p-1 p p+1 … N)
  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const nums: (number | '…')[] = [1]
    if (page > 3) nums.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i)
    if (page < totalPages - 2) nums.push('…')
    nums.push(totalPages)
    return nums
  }, [page, totalPages])

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 탭 */}
      <div className="bg-gray-800 border-b border-gray-700 px-4">
        <div className="flex items-center gap-0 max-w-screen-2xl mx-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-blue-500 text-blue-400 font-medium'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="ml-auto text-xs text-gray-500 pb-2 pt-2">
            {stocks.length > 0 && `${stocks.length}개 종목`}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-screen-2xl mx-auto">
          {error ? (
            <div className="flex items-center justify-center h-40 text-red-400 text-sm">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">데이터 불러오는 중...</span>
                <span className="text-gray-600 text-xs">Yahoo Finance / KRX API 연결 중...</span>
              </div>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
              검색 결과가 없습니다. 필터를 조정해보세요.
            </div>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-gray-850 border-b border-gray-700 z-10">
                <tr className="bg-gray-900">
                  <th className="text-center text-gray-500 font-medium px-2 py-2 w-8">#</th>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="text-left text-gray-400 font-medium px-3 py-2 cursor-pointer hover:text-white select-none whitespace-nowrap"
                    >
                      {col.label}
                      <SortIcon col={col.key} sort={sort} />
                    </th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((stock, i) => (
                  <tr
                    key={`${stock.ticker}-${stock.market}`}
                    className="border-b border-gray-800 hover:bg-gray-750 cursor-pointer transition-colors group"
                    onClick={() => onSelectStock(stock.ticker, stock.market)}
                    style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                  >
                    <td className="text-center text-gray-600 px-2 py-1.5">{startIdx + i + 1}</td>
                    {columns.map(col => (
                      <td key={col.key} className="px-3 py-1.5 whitespace-nowrap">
                        {renderCell(col.key, stock)}
                      </td>
                    ))}
                    <td className="px-2">
                      <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      {!loading && !error && sorted.length > 0 && (
        <div className="border-t border-gray-700 bg-gray-800 px-4 py-2">
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">

            {/* 좌: 표시 건수 선택 */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>페이지당</span>
              {PAGE_SIZE_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => { setPageSize(n); setPage(1) }}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    pageSize === n
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="text-gray-600 ml-1">
                ({startIdx + 1}–{Math.min(startIdx + pageSize, sorted.length)} / {sorted.length}개)
              </span>
            </div>

            {/* 중앙: 페이지 번호 */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNums.map((n, idx) =>
                n === '…' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-gray-600 text-xs select-none">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n as number)}
                    className={`w-7 h-7 rounded text-xs transition-colors ${
                      page === n
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 우: 페이지 직접 입력 */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>페이지 이동</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={e => {
                  const v = parseInt(e.target.value)
                  if (!isNaN(v) && v >= 1 && v <= totalPages) setPage(v)
                }}
                className="w-12 px-1.5 py-0.5 bg-gray-700 border border-gray-600 rounded text-white text-center text-xs focus:outline-none focus:border-blue-500"
              />
              <span>/ {totalPages}</span>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
