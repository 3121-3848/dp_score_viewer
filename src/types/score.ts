export type ClearType =
  | 'FULLCOMBO CLEAR'
  | 'EX HARD CLEAR'
  | 'HARD CLEAR'
  | 'CLEAR'
  | 'EASY CLEAR'
  | 'ASSIST CLEAR'
  | 'FAILED'
  | 'NO PLAY'

export type DJLevel = 'AAA' | 'AA' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '---'

export type Difficulty = 'HYPER' | 'ANOTHER' | 'LEGGENDARIA'

export interface ChartScore {
  difficulty: number
  score: number
  pgreat: number
  great: number
  missCount: number | null
  clearType: ClearType
  djLevel: DJLevel
}

export interface ScoreEntry {
  version: string
  title: string
  genre: string
  artist: string
  playCount: number
  beginner: ChartScore | null
  normal: ChartScore | null
  hyper: ChartScore | null
  another: ChartScore | null
  leggendaria: ChartScore | null
  lastPlayDate: string
}

export interface ParsedChartData {
  version: string
  title: string
  difficulty: Difficulty
  officialLevel: number
  unofficialLevel: number | null
  score: number
  pgreat: number
  great: number
  missCount: number | null
  clearType: ClearType
  djLevel: DJLevel
  lastPlayDate: string
}

export type SortKey = 'title' | 'missCount' | 'clearType' | 'lastPlayDate'
export type SortDirection = 'asc' | 'desc'
