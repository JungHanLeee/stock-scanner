import { useState, useCallback, useEffect } from 'react'
import { Header } from './components/Header'
import { FilterPanel } from './components/FilterPanel'
import { StockTable } from './components/StockTable'
import { StockModal } from './components/StockModal'
import { useScreener } from './hooks/useScreener'

function App() {
  const {
    stocks, total, loading, error, filters,
    updateFilters, resetFilters, search,
    filterHistory, loadFromHistory, deleteHistory, clearHistory,
  } = useScreener()
  const [selectedStock, setSelectedStock] = useState<{ ticker: string; market: string } | null>(null)

  // 페이지 로드 시 자동 검색
  useEffect(() => {
    search()
  }, [])

  const handleMarketChange = useCallback((m: 'US' | 'KR' | 'ALL') => {
    updateFilters({ market: m })
  }, [updateFilters])

  const handleSelectStock = useCallback((ticker: string, market: string) => {
    setSelectedStock({ ticker, market })
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      <Header
        market={filters.market}
        onMarketChange={handleMarketChange}
        total={total}
        loading={loading}
      />

      <FilterPanel
        filters={filters}
        onChange={updateFilters}
        onSearch={() => search()}
        onReset={resetFilters}
        filterHistory={filterHistory}
        onLoadHistory={entry => { loadFromHistory(entry); }}
        onDeleteHistory={deleteHistory}
        onClearHistory={clearHistory}
      />

      <StockTable
        stocks={stocks}
        loading={loading}
        error={error}
        onSelectStock={handleSelectStock}
      />

      {selectedStock && (
        <StockModal
          ticker={selectedStock.ticker}
          market={selectedStock.market}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  )
}

export default App
