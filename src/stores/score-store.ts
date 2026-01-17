import { create } from 'zustand'
import {
  ScoreEntry,
  ParsedChartData,
  DifficultyTable,
  MatchingTable,
  SortKey,
  SortDirection,
  ClearType,
  Difficulty,
} from '@/types'
import { parseCSV } from '@/lib/csv-parser'
import { loadDifficultyTable, loadMatchingTable } from '@/lib/data-loader'
import { CLEAR_TYPE_ORDER } from '@/lib/constants'

interface ScoreState {
  // Raw data
  scores: ScoreEntry[]
  difficultyTable: DifficultyTable
  matchingTable: MatchingTable

  // Processed data
  chartData: ParsedChartData[]

  // UI state
  isLoading: boolean
  isDataLoaded: boolean
  sortKey: SortKey
  sortDirection: SortDirection
  selectedLevel: string | null

  // Actions
  loadCSV: (csvText: string) => void
  initializeData: () => Promise<void>
  setSortKey: (key: SortKey) => void
  setSortDirection: (direction: SortDirection) => void
  setSelectedLevel: (level: string | null) => void
  getChartDataByLevel: () => Map<string, ParsedChartData[]>
  getStats: () => Map<string, Map<ClearType, number>>
}

function lookupTitle(
  title: string,
  matchingTable: MatchingTable
): string {
  return matchingTable[title] || title
}

function processScores(
  scores: ScoreEntry[],
  difficultyTable: DifficultyTable,
  matchingTable: MatchingTable
): ParsedChartData[] {
  const charts: ParsedChartData[] = []

  for (const score of scores) {
    const lookupName = lookupTitle(score.title, matchingTable)
    const diffEntry = difficultyTable[lookupName]

    const difficulties: { key: 'hyper' | 'another' | 'leggendaria'; label: Difficulty }[] = [
      { key: 'hyper', label: 'HYPER' },
      { key: 'another', label: 'ANOTHER' },
      { key: 'leggendaria', label: 'LEGGENDARIA' },
    ]

    for (const { key, label } of difficulties) {
      const chartScore = score[key]
      if (!chartScore) continue

      const diffInfo = diffEntry?.[key]
      const unofficialLevel = diffInfo?.unofficial ?? null

      charts.push({
        version: score.version,
        title: score.title,
        difficulty: label,
        officialLevel: chartScore.difficulty,
        unofficialLevel,
        score: chartScore.score,
        pgreat: chartScore.pgreat,
        great: chartScore.great,
        missCount: chartScore.missCount,
        clearType: chartScore.clearType,
        djLevel: chartScore.djLevel,
        lastPlayDate: score.lastPlayDate,
      })
    }
  }

  return charts
}

function sortChartData(
  data: ParsedChartData[],
  sortKey: SortKey,
  sortDirection: SortDirection
): ParsedChartData[] {
  const sorted = [...data].sort((a, b) => {
    let comparison = 0

    switch (sortKey) {
      case 'title':
        comparison = a.title.localeCompare(b.title, 'ja')
        break
      case 'missCount':
        const aMiss = a.missCount ?? Infinity
        const bMiss = b.missCount ?? Infinity
        comparison = aMiss - bMiss
        break
      case 'clearType':
        const aIndex = CLEAR_TYPE_ORDER.indexOf(a.clearType)
        const bIndex = CLEAR_TYPE_ORDER.indexOf(b.clearType)
        comparison = aIndex - bIndex
        break
      case 'lastPlayDate':
        comparison = a.lastPlayDate.localeCompare(b.lastPlayDate)
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  return sorted
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  scores: [],
  difficultyTable: {},
  matchingTable: {},
  chartData: [],
  isLoading: false,
  isDataLoaded: false,
  sortKey: 'clearType',
  sortDirection: 'asc',
  selectedLevel: null,

  initializeData: async () => {
    set({ isLoading: true })
    try {
      const [difficultyTable, matchingTable] = await Promise.all([
        loadDifficultyTable(),
        loadMatchingTable(),
      ])
      set({ difficultyTable, matchingTable, isDataLoaded: true })
    } catch (error) {
      console.error('Failed to initialize data:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  loadCSV: (csvText: string) => {
    const { difficultyTable, matchingTable, sortKey, sortDirection } = get()
    const scores = parseCSV(csvText)
    const chartData = processScores(scores, difficultyTable, matchingTable)
    const sortedChartData = sortChartData(chartData, sortKey, sortDirection)
    set({ scores, chartData: sortedChartData })
  },

  setSortKey: (key: SortKey) => {
    const { chartData, sortDirection } = get()
    const sortedChartData = sortChartData(chartData, key, sortDirection)
    set({ sortKey: key, chartData: sortedChartData })
  },

  setSortDirection: (direction: SortDirection) => {
    const { chartData, sortKey } = get()
    const sortedChartData = sortChartData(chartData, sortKey, direction)
    set({ sortDirection: direction, chartData: sortedChartData })
  },

  setSelectedLevel: (level: string | null) => {
    set({ selectedLevel: level })
  },

  getChartDataByLevel: () => {
    const { chartData } = get()
    const byLevel = new Map<string, ParsedChartData[]>()

    for (const chart of chartData) {
      const level = chart.unofficialLevel?.toString() ?? 'Unknown'
      if (!byLevel.has(level)) {
        byLevel.set(level, [])
      }
      byLevel.get(level)!.push(chart)
    }

    return byLevel
  },

  getStats: () => {
    const { chartData } = get()
    const stats = new Map<string, Map<ClearType, number>>()

    for (const chart of chartData) {
      const level = chart.unofficialLevel?.toString() ?? 'Unknown'
      if (!stats.has(level)) {
        stats.set(level, new Map())
      }
      const levelStats = stats.get(level)!
      const count = levelStats.get(chart.clearType) ?? 0
      levelStats.set(chart.clearType, count + 1)
    }

    return stats
  },
}))
