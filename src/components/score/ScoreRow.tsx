import { ParsedChartData, SortKey } from '@/types'
import { CLEAR_TYPE_COLORS, DIFFICULTY_BADGES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ScoreRowProps {
  chart: ParsedChartData
  sortKey: SortKey
}

export function ScoreRow({ chart, sortKey }: ScoreRowProps) {
  const clearColor = CLEAR_TYPE_COLORS[chart.clearType]
  const diffBadge = DIFFICULTY_BADGES[chart.difficulty]

  const getSortValue = () => {
    switch (sortKey) {
      case 'version':
        return ''
      case 'missCount':
        return chart.missCount !== null ? chart.missCount.toString() : '-'
      case 'clearType':
        return ''
      case 'lastPlayDate':
        return chart.lastPlayDate.split(' ')[0] || '-'
      case 'title':
      default:
        return ''
    }
  }

  const sortValue = getSortValue()

  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div
        className={cn(
          'w-3 h-3 rounded-full shrink-0',
          clearColor.bg
        )}
        title={chart.clearType}
      />

      <span className="text-xs text-gray-500 w-24 shrink-0 truncate hidden sm:block">
        {chart.version}
      </span>

      <span className="flex-1 text-sm truncate min-w-0">{chart.displayTitle}</span>

      <span
        className={cn(
          'w-6 h-6 flex items-center justify-center rounded text-xs font-bold shrink-0',
          diffBadge.bg,
          diffBadge.text
        )}
      >
        {diffBadge.label}
      </span>

      {sortValue && (
        <span className="text-xs text-gray-500 w-16 text-right shrink-0">
          {sortValue}
        </span>
      )}
    </div>
  )
}
