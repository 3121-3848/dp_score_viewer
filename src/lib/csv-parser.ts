import Papa from 'papaparse'
import { ScoreEntry, ChartScore, ClearType, DJLevel } from '@/types'

interface CSVRow {
  バージョン: string
  タイトル: string
  ジャンル: string
  アーティスト: string
  プレー回数: string
  'BEGINNER 難易度': string
  'BEGINNER スコア': string
  'BEGINNER PGreat': string
  'BEGINNER Great': string
  'BEGINNER ミスカウント': string
  'BEGINNER クリアタイプ': string
  'BEGINNER DJ LEVEL': string
  'NORMAL 難易度': string
  'NORMAL スコア': string
  'NORMAL PGreat': string
  'NORMAL Great': string
  'NORMAL ミスカウント': string
  'NORMAL クリアタイプ': string
  'NORMAL DJ LEVEL': string
  'HYPER 難易度': string
  'HYPER スコア': string
  'HYPER PGreat': string
  'HYPER Great': string
  'HYPER ミスカウント': string
  'HYPER クリアタイプ': string
  'HYPER DJ LEVEL': string
  'ANOTHER 難易度': string
  'ANOTHER スコア': string
  'ANOTHER PGreat': string
  'ANOTHER Great': string
  'ANOTHER ミスカウント': string
  'ANOTHER クリアタイプ': string
  'ANOTHER DJ LEVEL': string
  'LEGGENDARIA 難易度': string
  'LEGGENDARIA スコア': string
  'LEGGENDARIA PGreat': string
  'LEGGENDARIA Great': string
  'LEGGENDARIA ミスカウント': string
  'LEGGENDARIA クリアタイプ': string
  'LEGGENDARIA DJ LEVEL': string
  最終プレー日時: string
}

function parseClearType(value: string): ClearType {
  const normalized = value.trim().toUpperCase()
  if (normalized === 'FULLCOMBO CLEAR' || normalized === 'FULL COMBO') return 'FULLCOMBO CLEAR'
  if (normalized === 'EX HARD CLEAR') return 'EX HARD CLEAR'
  if (normalized === 'HARD CLEAR') return 'HARD CLEAR'
  if (normalized === 'CLEAR') return 'CLEAR'
  if (normalized === 'EASY CLEAR') return 'EASY CLEAR'
  if (normalized === 'ASSIST CLEAR') return 'ASSIST CLEAR'
  if (normalized === 'FAILED') return 'FAILED'
  return 'NO PLAY'
}

function parseDJLevel(value: string): DJLevel {
  const normalized = value.trim().toUpperCase()
  if (normalized === 'AAA') return 'AAA'
  if (normalized === 'AA') return 'AA'
  if (normalized === 'A') return 'A'
  if (normalized === 'B') return 'B'
  if (normalized === 'C') return 'C'
  if (normalized === 'D') return 'D'
  if (normalized === 'E') return 'E'
  if (normalized === 'F') return 'F'
  return '---'
}

function parseChartScore(
  difficulty: string,
  score: string,
  pgreat: string,
  great: string,
  missCount: string,
  clearType: string,
  djLevel: string
): ChartScore | null {
  const diff = parseInt(difficulty, 10)
  if (isNaN(diff) || diff === 0) return null

  return {
    difficulty: diff,
    score: parseInt(score, 10) || 0,
    pgreat: parseInt(pgreat, 10) || 0,
    great: parseInt(great, 10) || 0,
    missCount: missCount === '---' ? null : parseInt(missCount, 10) || null,
    clearType: parseClearType(clearType),
    djLevel: parseDJLevel(djLevel),
  }
}

export function parseCSV(csvText: string): ScoreEntry[] {
  const result = Papa.parse<CSVRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  return result.data.map((row) => ({
    version: row['バージョン'] || '',
    title: row['タイトル'] || '',
    genre: row['ジャンル'] || '',
    artist: row['アーティスト'] || '',
    playCount: parseInt(row['プレー回数'], 10) || 0,
    beginner: parseChartScore(
      row['BEGINNER 難易度'],
      row['BEGINNER スコア'],
      row['BEGINNER PGreat'],
      row['BEGINNER Great'],
      row['BEGINNER ミスカウント'],
      row['BEGINNER クリアタイプ'],
      row['BEGINNER DJ LEVEL']
    ),
    normal: parseChartScore(
      row['NORMAL 難易度'],
      row['NORMAL スコア'],
      row['NORMAL PGreat'],
      row['NORMAL Great'],
      row['NORMAL ミスカウント'],
      row['NORMAL クリアタイプ'],
      row['NORMAL DJ LEVEL']
    ),
    hyper: parseChartScore(
      row['HYPER 難易度'],
      row['HYPER スコア'],
      row['HYPER PGreat'],
      row['HYPER Great'],
      row['HYPER ミスカウント'],
      row['HYPER クリアタイプ'],
      row['HYPER DJ LEVEL']
    ),
    another: parseChartScore(
      row['ANOTHER 難易度'],
      row['ANOTHER スコア'],
      row['ANOTHER PGreat'],
      row['ANOTHER Great'],
      row['ANOTHER ミスカウント'],
      row['ANOTHER クリアタイプ'],
      row['ANOTHER DJ LEVEL']
    ),
    leggendaria: parseChartScore(
      row['LEGGENDARIA 難易度'],
      row['LEGGENDARIA スコア'],
      row['LEGGENDARIA PGreat'],
      row['LEGGENDARIA Great'],
      row['LEGGENDARIA ミスカウント'],
      row['LEGGENDARIA クリアタイプ'],
      row['LEGGENDARIA DJ LEVEL']
    ),
    lastPlayDate: row['最終プレー日時'] || '',
  }))
}
