import { describe, it, expect, beforeEach } from 'vitest'
import { useScoreStore } from './score-store'
import { DifficultyTable, MatchingTable } from '@/types'

// Reset store before each test
beforeEach(() => {
  useScoreStore.setState({
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
    itemsPerPage: 10,
  })
})

describe('useScoreStore', () => {
  describe('initial state', () => {
    it('should have empty scores', () => {
      const state = useScoreStore.getState()
      expect(state.scores).toHaveLength(0)
    })

    it('should have empty chartData', () => {
      const state = useScoreStore.getState()
      expect(state.chartData).toHaveLength(0)
    })

    it('should have clearType as default sort key', () => {
      const state = useScoreStore.getState()
      expect(state.sortKey).toBe('clearType')
    })

    it('should have asc as default sort direction', () => {
      const state = useScoreStore.getState()
      expect(state.sortDirection).toBe('asc')
    })

    it('should have 10 as default items per page', () => {
      const state = useScoreStore.getState()
      expect(state.itemsPerPage).toBe(10)
    })

    it('should have currentPage as 1', () => {
      const state = useScoreStore.getState()
      expect(state.currentPage).toBe(1)
    })
  })

  describe('setSortKey', () => {
    it('should update sort key', () => {
      useScoreStore.getState().setSortKey('title')
      expect(useScoreStore.getState().sortKey).toBe('title')
    })

    it('should reset currentPage to 1', () => {
      useScoreStore.setState({ currentPage: 5 })
      useScoreStore.getState().setSortKey('title')
      expect(useScoreStore.getState().currentPage).toBe(1)
    })
  })

  describe('setSortDirection', () => {
    it('should update sort direction', () => {
      useScoreStore.getState().setSortDirection('desc')
      expect(useScoreStore.getState().sortDirection).toBe('desc')
    })

    it('should reset currentPage to 1', () => {
      useScoreStore.setState({ currentPage: 5 })
      useScoreStore.getState().setSortDirection('desc')
      expect(useScoreStore.getState().currentPage).toBe(1)
    })
  })

  describe('setSelectedLevel', () => {
    it('should update selected level', () => {
      useScoreStore.getState().setSelectedLevel('10.5')
      expect(useScoreStore.getState().selectedLevel).toBe('10.5')
    })

    it('should reset currentPage to 1', () => {
      useScoreStore.setState({ currentPage: 5 })
      useScoreStore.getState().setSelectedLevel('10.5')
      expect(useScoreStore.getState().currentPage).toBe(1)
    })

    it('should allow null value', () => {
      useScoreStore.getState().setSelectedLevel('10.5')
      useScoreStore.getState().setSelectedLevel(null)
      expect(useScoreStore.getState().selectedLevel).toBeNull()
    })
  })

  describe('setCurrentPage', () => {
    it('should update current page', () => {
      useScoreStore.getState().setCurrentPage(3)
      expect(useScoreStore.getState().currentPage).toBe(3)
    })
  })

  describe('setItemsPerPage', () => {
    it('should update items per page', () => {
      useScoreStore.getState().setItemsPerPage(20)
      expect(useScoreStore.getState().itemsPerPage).toBe(20)
    })

    it('should reset currentPage to 1', () => {
      useScoreStore.setState({ currentPage: 5 })
      useScoreStore.getState().setItemsPerPage(20)
      expect(useScoreStore.getState().currentPage).toBe(1)
    })
  })

  describe('clearData', () => {
    it('should clear scores and chartData', () => {
      useScoreStore.setState({
        scores: [{ version: 'test', title: 'test' }] as any,
        chartData: [{ title: 'test' }] as any,
        csvText: 'test data',
      })

      useScoreStore.getState().clearData()

      const state = useScoreStore.getState()
      expect(state.scores).toHaveLength(0)
      expect(state.chartData).toHaveLength(0)
      expect(state.csvText).toBe('')
    })

    it('should reset currentPage to 1', () => {
      useScoreStore.setState({ currentPage: 5 })
      useScoreStore.getState().clearData()
      expect(useScoreStore.getState().currentPage).toBe(1)
    })
  })

  describe('getChartDataByLevel', () => {
    it('should return empty map for no data', () => {
      const result = useScoreStore.getState().getChartDataByLevel()
      expect(result.size).toBe(0)
    })

    it('should group chart data by level', () => {
      useScoreStore.setState({
        chartData: [
          { unofficialLevel: 10.5, title: 'Song A' },
          { unofficialLevel: 10.5, title: 'Song B' },
          { unofficialLevel: 11.0, title: 'Song C' },
        ] as any,
      })

      const result = useScoreStore.getState().getChartDataByLevel()

      expect(result.size).toBe(2)
      expect(result.get('10.5')).toHaveLength(2)
      expect(result.get('11.0')).toHaveLength(1)
    })

    it('should handle null unofficial level as Unknown', () => {
      useScoreStore.setState({
        chartData: [
          { unofficialLevel: null, title: 'Song A' },
        ] as any,
      })

      const result = useScoreStore.getState().getChartDataByLevel()

      expect(result.has('Unknown')).toBe(true)
      expect(result.get('Unknown')).toHaveLength(1)
    })
  })

  describe('getStats', () => {
    it('should return empty map for no data', () => {
      const result = useScoreStore.getState().getStats()
      expect(result.size).toBe(0)
    })

    it('should count clear types by level', () => {
      useScoreStore.setState({
        chartData: [
          { unofficialLevel: 10.5, clearType: 'CLEAR' },
          { unofficialLevel: 10.5, clearType: 'CLEAR' },
          { unofficialLevel: 10.5, clearType: 'HARD CLEAR' },
          { unofficialLevel: 11.0, clearType: 'FAILED' },
        ] as any,
      })

      const result = useScoreStore.getState().getStats()

      expect(result.size).toBe(2)

      const level105Stats = result.get('10.5')
      expect(level105Stats?.get('CLEAR')).toBe(2)
      expect(level105Stats?.get('HARD CLEAR')).toBe(1)

      const level11Stats = result.get('11.0')
      expect(level11Stats?.get('FAILED')).toBe(1)
    })
  })

  describe('loadCSV', () => {
    beforeEach(() => {
      // Set up difficulty table for testing
      const difficultyTable: DifficultyTable = {
        'Test Song': {
          version: '1st style',
          title: 'Test Song',
          hyper: { official: 7, unofficial: 7.5 },
          another: { official: 10, unofficial: 10.2 },
          leggendaria: null,
        },
      }
      const matchingTable: MatchingTable = {}
      const versionOrder = ['1st style', '2nd style']

      useScoreStore.setState({
        difficultyTable,
        matchingTable,
        versionOrder,
        isDataLoaded: true,
      })
    })

    it('should parse CSV and create chart data', () => {
      const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
1st style,Test Song,TEST,Test Artist,1,0,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,7,1000,400,200,50,CLEAR,A,10,800,300,200,100,FAILED,B,0,0,0,0,---,NO PLAY,---,2025-01-01 12:00`

      useScoreStore.getState().loadCSV(csv)

      const state = useScoreStore.getState()
      expect(state.scores).toHaveLength(1)
      expect(state.chartData.length).toBeGreaterThan(0)
    })

    it('should reset currentPage to 1', () => {
      useScoreStore.setState({ currentPage: 5 })

      const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
1st style,Test Song,TEST,Test Artist,1,0,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,7,1000,400,200,50,CLEAR,A,0,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-01-01 12:00`

      useScoreStore.getState().loadCSV(csv)

      expect(useScoreStore.getState().currentPage).toBe(1)
    })
  })
})
