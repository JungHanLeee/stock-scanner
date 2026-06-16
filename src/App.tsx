import { useState, useCallback, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { FilterPanel } from './components/FilterPanel'
import { StockTable } from './components/StockTable'
import { StockModal } from './components/StockModal'
import { Footer } from './components/Footer'
import { Seo, SITE_URL } from './components/Seo'
import { useScreener } from './hooks/useScreener'
import AboutPage from './pages/About'
import PrivacyPage from './pages/Privacy'
import GuidePage from './pages/Guide'
import BlogPage from './pages/Blog'
import BlogPostPage from './pages/BlogPost'

function ScreenerPage() {
  const {
    stocks, total, loading, error, filters,
    updateFilters, resetFilters, search,
    filterHistory, loadFromHistory, deleteHistory, clearHistory,
  } = useScreener()
  const [selectedStock, setSelectedStock] = useState<{ ticker: string; market: string } | null>(null)

  useEffect(() => {
    search()
  }, [])

  const handleMarketChange = useCallback((m: 'US' | 'KR' | 'ALL') => {
    updateFilters({ market: m })
  }, [updateFilters])

  const handleSelectStock = useCallback((ticker: string, market: string) => {
    setSelectedStock({ ticker, market })
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '주식 스크리너 | Stock Screener KR',
    url: SITE_URL,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    description:
      '미국·한국 주식을 PER, PBR, ROE, 배당수익률 등 30여 가지 재무 지표로 무료 필터링하는 주식 스크리너.',
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      <Seo path="/" jsonLd={jsonLd} />
      <Header market={filters.market} onMarketChange={handleMarketChange} total={total} loading={loading} />
      <FilterPanel
        filters={filters}
        onChange={updateFilters}
        onSearch={() => search()}
        onReset={resetFilters}
        filterHistory={filterHistory}
        onLoadHistory={entry => { loadFromHistory(entry) }}
        onDeleteHistory={deleteHistory}
        onClearHistory={clearHistory}
      />
      <StockTable stocks={stocks} loading={loading} error={error} onSelectStock={handleSelectStock} />
      {selectedStock && (
        <StockModal ticker={selectedStock.ticker} market={selectedStock.market} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  )
}

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Header market="US" onMarketChange={() => {}} total={0} loading={false} />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ScreenerPage />} />
      <Route path="/about" element={<PageLayout><AboutPage /></PageLayout>} />
      <Route path="/privacy" element={<PageLayout><PrivacyPage /></PageLayout>} />
      <Route path="/guide" element={<PageLayout><GuidePage /></PageLayout>} />
      <Route path="/blog" element={<PageLayout><BlogPage /></PageLayout>} />
      <Route path="/blog/:slug" element={<PageLayout><BlogPostPage /></PageLayout>} />
    </Routes>
  )
}

export default App
