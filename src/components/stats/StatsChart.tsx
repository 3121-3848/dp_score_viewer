import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useScoreStore } from '@/stores/score-store'
import { ClearType } from '@/types'
import { CLEAR_TYPE_ORDER, CHART_COLORS } from '@/lib/constants'

interface ChartDataItem {
  level: string
  total: number
  [key: string]: number | string
}

const CLEAR_TYPE_LABELS: Record<string, string> = {
  'FULLCOMBO CLEAR': 'FC',
  'EX HARD CLEAR': 'EXH',
  'HARD CLEAR': 'HARD',
  'CLEAR': 'CLEAR',
  'EASY CLEAR': 'EASY',
  'ASSIST CLEAR': 'ASSIST',
  'FAILED': 'F',
  'NO PLAY': 'NP',
}

interface StatsChartProps {
  onLevelClick?: (level: string) => void
}

export function StatsChart({ onLevelClick }: StatsChartProps) {
  const chartData = useScoreStore((state) => state.chartData)
  const getStats = useScoreStore((state) => state.getStats)

  const stats = useMemo(() => getStats(), [getStats, chartData])

  const barData = useMemo(() => {
    const data: ChartDataItem[] = []

    const sortedLevels = Array.from(stats.keys()).sort((a, b) => {
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      return parseFloat(a) - parseFloat(b)
    })

    for (const level of sortedLevels) {
      const levelStats = stats.get(level)!
      const item: ChartDataItem = { level, total: 0 }

      for (const clearType of CLEAR_TYPE_ORDER) {
        const count = levelStats.get(clearType) || 0
        item[clearType] = count
        item.total += count
      }

      data.push(item)
    }

    return data
  }, [stats])

  if (chartData.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>クリア状況統計</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Custom legend – wraps consistently on all screen sizes */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
          {CLEAR_TYPE_ORDER.map((clearType) => (
            <div key={clearType} className="flex items-center gap-1 text-sm">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[clearType] }}
              />
              <span>{CLEAR_TYPE_LABELS[clearType]}</span>
            </div>
          ))}
        </div>

        <div className="h-[400px] sm:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              onClick={(data) => {
                if (onLevelClick && data && data.activeLabel) {
                  onLevelClick(data.activeLabel as string)
                }
              }}
              style={{ cursor: onLevelClick ? 'pointer' : 'default' }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="level" width={50} />
              <Tooltip
                content={({ payload, label }) => {
                  if (!payload || payload.length === 0) return null
                  const total = payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0)
                  return (
                    <div className="bg-white border rounded-lg shadow-lg p-3">
                      <p className="font-bold mb-2">難易度 {label}</p>
                      {payload.map((p) => {
                        if (Number(p.value) === 0) return null
                        const percent = ((Number(p.value) / total) * 100).toFixed(1)
                        return (
                          <div key={p.dataKey} className="flex items-center gap-2 text-sm">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: p.color }}
                            />
                            <span>{CLEAR_TYPE_LABELS[p.dataKey as string] ?? p.dataKey}: {p.value} ({percent}%)</span>
                          </div>
                        )
                      })}
                      <p className="text-sm mt-2 text-gray-500">合計: {total}</p>
                      {onLevelClick && (
                        <p className="text-xs mt-1 text-blue-500">クリックしてスコア一覧へ</p>
                      )}
                    </div>
                  )
                }}
              />
              {CLEAR_TYPE_ORDER.map((clearType) => (
                <Bar
                  key={clearType}
                  dataKey={clearType}
                  stackId="a"
                  fill={CHART_COLORS[clearType]}
                >
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-2">
          {barData.map((item) => {
            const getCount = (key: string) => Number(item[key]) || 0
            const clearCount = getCount('FULLCOMBO CLEAR') +
              getCount('EX HARD CLEAR') +
              getCount('HARD CLEAR') +
              getCount('CLEAR') +
              getCount('EASY CLEAR') +
              getCount('ASSIST CLEAR')
            const clearRate = item.total > 0 ? ((clearCount / item.total) * 100).toFixed(1) : '0'

            return (
              <div
                key={item.level}
                className={`flex items-center gap-2 text-sm rounded px-1 ${onLevelClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => onLevelClick?.(item.level)}
              >
                <span className="w-10 font-medium flex-shrink-0">{item.level}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden flex min-w-0">
                  {CLEAR_TYPE_ORDER.map((clearType) => {
                    const count = (item[clearType] || 0) as number
                    if (count === 0) return null
                    const percent = (count / item.total) * 100
                    return (
                      <div
                        key={clearType}
                        style={{
                          width: `${percent}%`,
                          backgroundColor: CHART_COLORS[clearType as ClearType],
                        }}
                        title={`${CLEAR_TYPE_LABELS[clearType]}: ${count}`}
                      />
                    )
                  })}
                </div>
                <span className="w-24 text-right text-gray-500 flex-shrink-0 text-xs">
                  {clearRate}% ({clearCount}/{item.total})
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
