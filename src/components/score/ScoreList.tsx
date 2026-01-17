import { useMemo } from 'react'
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
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'clearType', label: 'クリアタイプ' },
  { value: 'title', label: 'タイトル' },
  { value: 'missCount', label: 'ミスカウント' },
  { value: 'lastPlayDate', label: '最終プレー日時' },
]

export function ScoreList() {
  const chartData = useScoreStore((state) => state.chartData)
  const sortKey = useScoreStore((state) => state.sortKey)
  const sortDirection = useScoreStore((state) => state.sortDirection)
  const setSortKey = useScoreStore((state) => state.setSortKey)
  const setSortDirection = useScoreStore((state) => state.setSortDirection)
  const selectedLevel = useScoreStore((state) => state.selectedLevel)
  const setSelectedLevel = useScoreStore((state) => state.setSelectedLevel)
  const getChartDataByLevel = useScoreStore((state) => state.getChartDataByLevel)

  const chartDataByLevel = useMemo(() => getChartDataByLevel(), [getChartDataByLevel, chartData])

  const sortedLevels = useMemo(() => {
    const levels = Array.from(chartDataByLevel.keys())
    return levels.sort((a, b) => {
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      return parseFloat(b) - parseFloat(a)
    })
  }, [chartDataByLevel])

  const handleSortKeyChange = (value: string) => {
    setSortKey(value as SortKey)
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  if (chartData.length === 0) {
    return null
  }

  const currentLevel = selectedLevel || sortedLevels[0] || 'Unknown'
  const currentCharts = chartDataByLevel.get(currentLevel) || []

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="list">スコア一覧</TabsTrigger>
          <TabsTrigger value="stats">統計</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg">
                  難易度表 {currentLevel} ({currentCharts.length}曲)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={sortKey} onValueChange={handleSortKeyChange}>
                    <SelectTrigger className="w-36">
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
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[60vh] overflow-y-auto">
                {currentCharts.map((chart, idx) => (
                  <ScoreRow
                    key={`${chart.title}-${chart.difficulty}-${idx}`}
                    chart={chart}
                    sortKey={sortKey}
                  />
                ))}
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
          <StatsChart />
        </TabsContent>
      </Tabs>
    </div>
  )
}
