import React, { useEffect, useState } from 'react'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { fetchStockDetail } from '../api/screener'
import type { PriceBar } from '../types/stock'

interface StockModalProps {
  ticker: string
  market: string
  onClose: () => void
}

interface DetailData {
  ticker: string
  name: string
  description: string
  history: PriceBar[]
  info: Record<string, number | null>
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-1 border-b border-gray-700">
    <span className="text-gray-400 text-xs">{label}</span>
    <span className="text-white text-xs font-medium">{value}</span>
  </div>
)

const fmtNum = (v: number | null | undefined, suffix = '', decimals = 2) => {
  if (v == null) return 'N/A'
  return `${v.toFixed(decimals)}${suffix}`
}

const fmtPrice = (v: number | null | undefined, isKR: boolean) => {
  if (v == null) return 'N/A'
  return isKR ? `${v.toLocaleString('ko-KR')}원` : `$${v.toFixed(2)}`
}

const fmtEps = (v: number | null | undefined, isKR: boolean) => {
  if (v == null) return 'N/A'
  return isKR ? `${v.toLocaleString('ko-KR')}원` : `$${v.toFixed(2)}`
}

const fmtLarge = (v: number | null | undefined, isKR: boolean) => {
  if (v == null) return 'N/A'
  if (isKR) {
    if (v >= 1e12) return `${(v / 1e12).toFixed(2)}조원`
    if (v >= 1e8)  return `${(v / 1e8).toFixed(2)}억원`
    return `${v.toLocaleString('ko-KR')}원`
  }
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`
  return `$${(v / 1e6).toFixed(2)}M`
}

export const StockModal: React.FC<StockModalProps> = ({ ticker, market, onClose }) => {
  const [data, setData] = useState<DetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const isKR = market === 'KR'

  useEffect(() => {
    setLoading(true)
    fetchStockDetail(ticker, market)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [ticker])

  const isCrUp = data?.history && data.history.length >= 2
    ? data.history[data.history.length - 1].close >= data.history[data.history.length - 2].close
    : true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-mono font-bold text-lg">{ticker}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${market === 'KR' ? 'bg-orange-900 text-orange-300' : 'bg-blue-900 text-blue-300'}`}>
                  {market}
                </span>
              </div>
              {data && <p className="text-gray-300 text-sm">{data.name}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <div className="p-6 space-y-5">
            {/* 가격 차트 */}
            {data.history.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-300">3개월 주가 추이</h3>
                  <div className="flex items-center gap-1 text-sm">
                    {isCrUp
                      ? <TrendingUp className="w-4 h-4 text-green-400" />
                      : <TrendingDown className="w-4 h-4 text-red-400" />
                    }
                    <span className={isCrUp ? 'text-green-400' : 'text-red-400'}>
                      {fmtPrice(data.history[data.history.length - 1]?.close, isKR)}
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data.history} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={v => v.slice(5)}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 6, fontSize: 11 }}
                      labelStyle={{ color: '#9CA3AF' }}
                      itemStyle={{ color: '#60A5FA' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke={isCrUp ? '#34D399' : '#F87171'}
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 주요 지표 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">가치평가 지표</h3>
                <div className="space-y-0.5">
                  <InfoRow label="시가총액"   value={fmtLarge(data.info.market_cap, isKR)} />
                  <InfoRow label="PER (TTM)" value={fmtNum(data.info.pe_ratio, 'x')} />
                  <InfoRow label="선행 PER"  value={fmtNum(data.info.forward_pe, 'x')} />
                  <InfoRow label="PBR"       value={fmtNum(data.info.pb_ratio, 'x')} />
                  <InfoRow label="EPS"       value={fmtEps(data.info.eps, isKR)} />
                  <InfoRow label="배당수익률" value={data.info.dividend_yield ? `${(data.info.dividend_yield).toFixed(2)}%` : 'N/A'} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">재무/기술 지표</h3>
                <div className="space-y-0.5">
                  <InfoRow label="52주 고점" value={fmtPrice(data.info.week52_high, isKR)} />
                  <InfoRow label="52주 저점" value={fmtPrice(data.info.week52_low, isKR)} />
                  <InfoRow label="베타"     value={fmtNum(data.info.beta)} />
                  <InfoRow label="ROE"      value={data.info.roe ? `${(data.info.roe * 100).toFixed(1)}%` : 'N/A'} />
                  <InfoRow label="매출"     value={fmtLarge(data.info.revenue, isKR)} />
                  <InfoRow label="순이익"   value={fmtLarge(data.info.net_income, isKR)} />
                </div>
              </div>
            </div>

            {/* 기업 설명 */}
            {data.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">기업 소개</h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-4">{data.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
            데이터를 불러올 수 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
