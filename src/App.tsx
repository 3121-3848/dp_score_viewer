import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { CSVUploader } from '@/components/upload/CSVUploader'
import { ScoreList } from '@/components/score/ScoreList'
import { useScoreStore } from '@/stores/score-store'

function App() {
  const initializeData = useScoreStore((state) => state.initializeData)
  const isDataLoaded = useScoreStore((state) => state.isDataLoaded)
  const isLoading = useScoreStore((state) => state.isLoading)
  const chartData = useScoreStore((state) => state.chartData)
  const clearData = useScoreStore((state) => state.clearData)

  useEffect(() => {
    initializeData()
  }, [initializeData])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {isLoading && (
          <div className="text-center py-8 text-gray-500">
            データを読み込んでいます...
          </div>
        )}

        {!isLoading && isDataLoaded && chartData.length === 0 && (
          <CSVUploader />
        )}

        {!isLoading && chartData.length > 0 && (
          <>
            <div className="flex justify-end">
              <button
                onClick={clearData}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                データをクリア
              </button>
            </div>
            <ScoreList />
          </>
        )}
      </main>

      <footer className="text-center py-4 text-gray-400 text-sm">
        DP スコアビューワー
      </footer>
    </div>
  )
}

export default App
