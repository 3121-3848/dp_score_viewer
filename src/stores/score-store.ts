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
import { loadDifficultyTable, loadMatchingTable, loadVersionOrder } from '@/lib/data-loader'
import { CLEAR_TYPE_ORDER } from '@/lib/constants'

const STORAGE_KEY_CSV = 'dp_score_viewer_csv'
const STORAGE_KEY_ITEMS_PER_PAGE = 'dp_score_viewer_items_per_page'

interface ScoreState {
  // Raw data
  scores: ScoreEntry[]
  difficultyTable: DifficultyTable
  matchingTable: MatchingTable
  versionOrder: string[]
  csvText: string

  // Processed data
  chartData: ParsedChartData[]

  // UI state
  isLoading: boolean
  isDataLoaded: boolean
  sortKey: SortKey
  sortDirection: SortDirection
  selectedLevel: string | null
  currentPage: number
  itemsPerPage: number

  // Actions
  loadCSV: (csvText: string) => void
  clearData: () => void
  initializeData: () => Promise<void>
  setSortKey: (key: SortKey) => void
  setSortDirection: (direction: SortDirection) => void
  setSelectedLevel: (level: string | null) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (count: number) => void
  getChartDataByLevel: () => Map<string, ParsedChartData[]>
  getStats: () => Map<string, Map<ClearType, number>>
}

function createReverseMatchingTable(matchingTable: MatchingTable): Map<string, string> {
  const reverse = new Map<string, string>()
  for (const [csvTitle, tableTitle] of Object.entries(matchingTable)) {
    reverse.set(tableTitle, csvTitle)
  }
  return reverse
}

function processScores(
  scores: ScoreEntry[],
  difficultyTable: DifficultyTable,
  matchingTable: MatchingTable
): ParsedChartData[] {
  const charts: ParsedChartData[] = []
  const processedCharts = new Set<string>()

  // Create a map from CSV title to score entry
  const scoreMap = new Map<string, ScoreEntry>()
  for (const score of scores) {
    scoreMap.set(score.title, score)
  }

  // Create reverse matching table (table title -> csv title)
  const reverseMatching = createReverseMatchingTable(matchingTable)

  const difficulties: { key: 'hyper' | 'another' | 'leggendaria'; label: Difficulty }[] = [
    { key: 'hyper', label: 'HYPER' },
    { key: 'another', label: 'ANOTHER' },
    { key: 'leggendaria', label: 'LEGGENDARIA' },
  ]

  // Process all songs from difficulty table
  for (const [tableTitle, diffEntry] of Object.entries(difficultyTable)) {
    // Find corresponding CSV title
    const csvTitle = reverseMatching.get(tableTitle) || tableTitle
    const score = scoreMap.get(csvTitle) || scoreMap.get(tableTitle)

    for (const { key, label } of difficulties) {
      const diffInfo = diffEntry[key]
      if (!diffInfo) continue

      const chartKey = `${tableTitle}-${label}`
      if (processedCharts.has(chartKey)) continue
      processedCharts.add(chartKey)

      const chartScore = score?.[key]

      if (chartScore) {
        // Has score data
        charts.push({
          version: diffEntry.version || '',
          title: csvTitle,
          displayTitle: tableTitle,
          difficulty: label,
          officialLevel: diffInfo.official ?? chartScore.difficulty,
          unofficialLevel: diffInfo.unofficial ?? null,
          score: chartScore.score,
          pgreat: chartScore.pgreat,
          great: chartScore.great,
          missCount: chartScore.missCount,
          clearType: chartScore.clearType,
          djLevel: chartScore.djLevel,
          lastPlayDate: score?.lastPlayDate || '',
        })
      } else {
        // NO PLAY entry
        charts.push({
          version: diffEntry.version || '',
          title: tableTitle,
          displayTitle: tableTitle,
          difficulty: label,
          officialLevel: diffInfo.official ?? 0,
          unofficialLevel: diffInfo.unofficial ?? null,
          score: 0,
          pgreat: 0,
          great: 0,
          missCount: null,
          clearType: 'NO PLAY',
          djLevel: '---',
          lastPlayDate: '',
        })
      }
    }
  }

  return charts
}

function sortChartData(
  data: ParsedChartData[],
  sortKey: SortKey,
  sortDirection: SortDirection,
  versionOrder: string[]
): ParsedChartData[] {
  const versionIndexMap = new Map<string, number>()
  versionOrder.forEach((v, i) => versionIndexMap.set(v, i))

  const sorted = [...data].sort((a, b) => {
    let comparison = 0

    switch (sortKey) {
      case 'version':
        const aVersionIndex = versionIndexMap.get(a.version) ?? 9999
        const bVersionIndex = versionIndexMap.get(b.version) ?? 9999
        comparison = aVersionIndex - bVersionIndex
        break
      case 'title':
        comparison = a.displayTitle.localeCompare(b.displayTitle, 'ja')
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

function loadItemsPerPage(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ITEMS_PER_PAGE)
    if (stored) {
      const value = parseInt(stored, 10)
      if (!isNaN(value) && value > 0) return value
    }
  } catch {
    // Ignore localStorage errors
  }
  return 10
}

function saveItemsPerPage(count: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS_PER_PAGE, count.toString())
  } catch {
    // Ignore localStorage errors
  }
}

function loadStoredCSV(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_CSV) || ''
  } catch {
    return ''
  }
}

function saveCSV(csvText: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CSV, csvText)
  } catch {
    // Ignore localStorage errors
  }
}

function clearStoredCSV(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CSV)
  } catch {
    // Ignore localStorage errors
  }
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  scores: [],
  difficultyTable: {},
  matchingTable: {},
  versionOrder: [],
  csvText: '',
  chartData: [],
  isLoading: false,
  isDataLoaded: false,
  sortKey: 'clearType',
  sortDirection: 'asc',
  selectedLevel: null,
  currentPage: 1,
  itemsPerPage: loadItemsPerPage(),

  initializeData: async () => {
    set({ isLoading: true })
    try {
      const [difficultyTable, matchingTable, versionOrder] = await Promise.all([
        loadDifficultyTable(),
        loadMatchingTable(),
        loadVersionOrder(),
      ])

      // Load stored CSV if available
      const storedCSV = loadStoredCSV()
      set({ difficultyTable, matchingTable, versionOrder, isDataLoaded: true })

      if (storedCSV) {
        get().loadCSV(storedCSV)
      }
    } catch (error) {
      console.error('Failed to initialize data:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  loadCSV: (csvText: string) => {
    const { difficultyTable, matchingTable, versionOrder, sortKey, sortDirection } = get()
    const scores = parseCSV(csvText)
    const chartData = processScores(scores, difficultyTable, matchingTable)
    const sortedChartData = sortChartData(chartData, sortKey, sortDirection, versionOrder)

    // Save to localStorage
    saveCSV(csvText)

    set({ scores, csvText, chartData: sortedChartData, currentPage: 1 })
  },

  clearData: () => {
    clearStoredCSV()
    set({ scores: [], csvText: '', chartData: [], currentPage: 1 })
  },

  setSortKey: (key: SortKey) => {
    const { chartData, sortDirection, versionOrder } = get()
    const sortedChartData = sortChartData(chartData, key, sortDirection, versionOrder)
    set({ sortKey: key, chartData: sortedChartData, currentPage: 1 })
  },

  setSortDirection: (direction: SortDirection) => {
    const { chartData, sortKey, versionOrder } = get()
    const sortedChartData = sortChartData(chartData, sortKey, direction, versionOrder)
    set({ sortDirection: direction, chartData: sortedChartData, currentPage: 1 })
  },

  setSelectedLevel: (level: string | null) => {
    set({ selectedLevel: level, currentPage: 1 })
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page })
  },

  setItemsPerPage: (count: number) => {
    saveItemsPerPage(count)
    set({ itemsPerPage: count, currentPage: 1 })
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
