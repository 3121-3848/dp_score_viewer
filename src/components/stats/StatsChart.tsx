import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Settings, X } from 'lucide-react'
import { useScoreStore } from '@/stores/score-store'
import { ClearType } from '@/types'
import { CLEAR_TYPE_ORDER, CHART_COLORS } from '@/lib/constants'

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

type RateTarget = 'fc' | 'exh' | 'hard' | 'clear' | 'easy' | 'assist' | 'played'

const RATE_TARGET_OPTIONS: { value: RateTarget; label: string }[] = [
  { value: 'fc', label: 'FC' },
  { value: 'exh', label: 'EXH 以上' },
  { value: 'hard', label: 'HARD 以上' },
  { value: 'clear', label: 'CLEAR 以上' },
  { value: 'easy', label: 'EASY 以上' },
  { value: 'assist', label: 'ASSIST 以上' },
  { value: 'played', label: 'プレー済' },
]

const RATE_TARGET_CLEAR_TYPES: Record<RateTarget, ClearType[]> = {
  fc: ['FULLCOMBO CLEAR'],
  exh: ['FULLCOMBO CLEAR', 'EX HARD CLEAR'],
  hard: ['FULLCOMBO CLEAR', 'EX HARD CLEAR', 'HARD CLEAR'],
  clear: ['FULLCOMBO CLEAR', 'EX HARD CLEAR', 'HARD CLEAR', 'CLEAR'],
  easy: ['FULLCOMBO CLEAR', 'EX HARD CLEAR', 'HARD CLEAR', 'CLEAR', 'EASY CLEAR'],
  assist: ['FULLCOMBO CLEAR', 'EX HARD CLEAR', 'HARD CLEAR', 'CLEAR', 'EASY CLEAR', 'ASSIST CLEAR'],
  played: ['FULLCOMBO CLEAR', 'EX HARD CLEAR', 'HARD CLEAR', 'CLEAR', 'EASY CLEAR', 'ASSIST CLEAR', 'FAILED'],
}

interface StatsChartProps {
  onLevelClick?: (level: string) => void
}

export function StatsChart({ onLevelClick }: StatsChartProps) {
  const chartData = useScoreStore((state) => state.chartData)
  const getStats = useScoreStore((state) => state.getStats)

  const [includeNoPlay, setIncludeNoPlay] = useState(true)
  const [rateTarget, setRateTarget] = useState<RateTarget>('easy')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const stats = useMemo(() => getStats(), [getStats, chartData])

  const barData = useMemo(() => {
    const sortedLevels = Array.from(stats.keys()).sort((a, b) => {
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      return parseFloat(a) - parseFloat(b)
    })

    return sortedLevels.map((level) => {
      const levelStats = stats.get(level)!
      const item: { level: string; total: number; [key: string]: number | string } = { level, total: 0 }
      for (const clearType of CLEAR_TYPE_ORDER) {
        const count = levelStats.get(clearType) || 0
        item[clearType] = count
        item.total += count
      }
      return item
    })
  }, [stats])

  if (chartData.length === 0) return null

  const visibleTypes = includeNoPlay
    ? CLEAR_TYPE_ORDER
    : CLEAR_TYPE_ORDER.filter((t) => t !== 'NO PLAY')

  const currentRateLabel = RATE_TARGET_OPTIONS.find((o) => o.value === rateTarget)?.label ?? ''

  return (
    <>
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="relative z-10 bg-white rounded-xl shadow-lg p-5 w-72 max-w-[90vw]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold">表示設定</h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!includeNoPlay}
                  onChange={(e) => setIncludeNoPlay(!e.target.checked)}
                  className="w-4 h-4 accent-gray-800"
                />
                <Label className="cursor-pointer font-normal">NO PLAY を除く</Label>
              </label>
              <div className="space-y-1.5">
                <Label className="text-gray-500 font-normal text-xs">割合対象</Label>
                <Select value={rateTarget} onValueChange={(v) => setRateTarget(v as RateTarget)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATE_TARGET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg leading-tight">クリア状況統計</CardTitle>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-xs shrink-0"
            >
              <span className="text-gray-400">{currentRateLabel}{!includeNoPlay ? ' · NP 除く' : ''}</span>
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
            {visibleTypes.map((clearType) => (
              <div key={clearType} className="flex items-center gap-1 text-sm">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: CHART_COLORS[clearType] }}
                />
                <span>{CLEAR_TYPE_LABELS[clearType]}</span>
              </div>
            ))}
          </div>

          {/* Bar rows */}
          <div className="space-y-2">
            {barData.map((item) => {
              const getCount = (key: string) => Number(item[key]) || 0
              const noPlayCount = getCount('NO PLAY')
              const denominator = includeNoPlay ? item.total : item.total - noPlayCount
              const targetCount = RATE_TARGET_CLEAR_TYPES[rateTarget].reduce(
                (sum, ct) => sum + getCount(ct), 0
              )
              const rate = denominator > 0 ? ((targetCount / denominator) * 100).toFixed(1) : '0'

              return (
                <div
                  key={item.level}
                  className={`flex items-center gap-2 text-sm rounded px-1 ${onLevelClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={() => onLevelClick?.(item.level)}
                >
                  <span className="w-10 font-medium flex-shrink-0">{item.level}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden flex min-w-0">
                    {visibleTypes.map((clearType) => {
                      const count = getCount(clearType)
                      if (count === 0 || denominator === 0) return null
                      const percent = (count / denominator) * 100
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
                    {rate}% ({targetCount}/{denominator})
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
