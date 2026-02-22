import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useScoreStore } from '@/stores/score-store'
import { ScoreRow } from './ScoreRow'
import { StatsChart } from '@/components/stats/StatsChart'
import { SortKey } from '@/types'
import { ArrowUpNarrowWide, ArrowDownWideNarrow, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'version', label: 'バージョン' },
  { value: 'title', label: 'タイトル' },
  { value: 'missCount', label: 'ミスカウント' },
  { value: 'clearType', label: 'クリアタイプ' },
  { value: 'lastPlayDate', label: '最終プレー日時' },
]

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export function ScoreList() {
  const chartData = useScoreStore((state) => state.chartData)
  const sortKey = useScoreStore((state) => state.sortKey)
  const sortDirection = useScoreStore((state) => state.sortDirection)
  const setSortKey = useScoreStore((state) => state.setSortKey)
  const setSortDirection = useScoreStore((state) => state.setSortDirection)
  const selectedLevel = useScoreStore((state) => state.selectedLevel)
  const setSelectedLevel = useScoreStore((state) => state.setSelectedLevel)
  const getChartDataByLevel = useScoreStore((state) => state.getChartDataByLevel)
  const currentPage = useScoreStore((state) => state.currentPage)
  const setCurrentPage = useScoreStore((state) => state.setCurrentPage)
  const itemsPerPage = useScoreStore((state) => state.itemsPerPage)
  const setItemsPerPage = useScoreStore((state) => state.setItemsPerPage)

  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.slice(1)
    return hash === 'stats' ? 'stats' : 'list'
  })

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${activeTab}`)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    window.location.hash = value
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const chartDataByLevel = useMemo(() => getChartDataByLevel(), [getChartDataByLevel, chartData])

  const sortedLevels = useMemo(() => {
    const levels = Array.from(chartDataByLevel.keys())
    return levels.sort((a, b) => {
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      return parseFloat(a) - parseFloat(b)
    })
  }, [chartDataByLevel])

  const handleSortKeyChange = (value: string) => {
    setSortKey(value as SortKey)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value, 10))
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  if (chartData.length === 0) {
    return null
  }

  const currentLevel = selectedLevel || sortedLevels[0] || 'Unknown'
  const currentCharts = chartDataByLevel.get(currentLevel) || []

  // Pagination
  const totalPages = Math.ceil(currentCharts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCharts = currentCharts.slice(startIndex, endIndex)

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleLevelClick = (level: string) => {
    setSelectedLevel(level)
    handleTabChange('list')
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="list">スコア一覧</TabsTrigger>
          <TabsTrigger value="stats">統計</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg leading-tight">
                  <span>難易度表 {currentLevel}</span>
                  <br />
                  <span className="text-sm font-normal text-gray-500">{currentCharts.length} 曲</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={sortKey} onValueChange={handleSortKeyChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSortDirection}
                    title={sortDirection === 'asc' ? '昇順' : '降順'}
                  >
                    {sortDirection === 'asc'
                      ? <ArrowDownWideNarrow className="h-4 w-4" />
                      : <ArrowUpNarrowWide className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div>
                {paginatedCharts.map((chart, idx) => (
                  <ScoreRow
                    key={`${chart.displayTitle}-${chart.difficulty}-${startIndex + idx}`}
                    chart={chart}
                    sortKey={sortKey}
                  />
                ))}
                {Array.from({ length: itemsPerPage - paginatedCharts.length }).map((_, i) => (
                  <div key={`spacer-${i}`} className="flex items-center py-2 px-3 border-b border-gray-100">
                    <div className="h-6" />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-3 py-3 border-t">
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt.toString()}>
                        {opt}件
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      前へ
                    </Button>
                    <span className="text-sm text-gray-600 w-16 text-center">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      次へ
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            {sortedLevels.map((level) => (
              <Button
                key={level}
                variant={currentLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
              >
                {level} ({chartDataByLevel.get(level)?.length || 0})
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <StatsChart onLevelClick={handleLevelClick} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
