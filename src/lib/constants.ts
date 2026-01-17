import { ClearType, Difficulty } from '@/types'

export const CLEAR_TYPE_COLORS: Record<ClearType, { bg: string; text: string; label: string }> = {
  'FULLCOMBO CLEAR': { bg: 'bg-orange-500', text: 'text-white', label: 'FC' },
  'EX HARD CLEAR': { bg: 'bg-yellow-400', text: 'text-black', label: 'EXH' },
  'HARD CLEAR': { bg: 'bg-red-500', text: 'text-white', label: 'HARD' },
  'CLEAR': { bg: 'bg-blue-500', text: 'text-white', label: 'CLR' },
  'EASY CLEAR': { bg: 'bg-green-500', text: 'text-white', label: 'EASY' },
  'ASSIST CLEAR': { bg: 'bg-purple-500', text: 'text-white', label: 'AST' },
  'FAILED': { bg: 'bg-gray-600', text: 'text-white', label: 'F' },
  'NO PLAY': { bg: 'bg-gray-300', text: 'text-gray-600', label: 'NP' },
}

export const CLEAR_TYPE_ORDER: ClearType[] = [
  'FULLCOMBO CLEAR',
  'EX HARD CLEAR',
  'HARD CLEAR',
  'CLEAR',
  'EASY CLEAR',
  'ASSIST CLEAR',
  'FAILED',
  'NO PLAY',
]

export const DIFFICULTY_BADGES: Record<Difficulty, { bg: string; text: string; label: string }> = {
  'HYPER': { bg: 'bg-yellow-400', text: 'text-black', label: 'H' },
  'ANOTHER': { bg: 'bg-red-500', text: 'text-white', label: 'A' },
  'LEGGENDARIA': { bg: 'bg-purple-600', text: 'text-white', label: 'L' },
}

export const CHART_COLORS: Record<ClearType, string> = {
  'FULLCOMBO CLEAR': '#f97316',
  'EX HARD CLEAR': '#facc15',
  'HARD CLEAR': '#ef4444',
  'CLEAR': '#3b82f6',
  'EASY CLEAR': '#22c55e',
  'ASSIST CLEAR': '#a855f7',
  'FAILED': '#4b5563',
  'NO PLAY': '#d1d5db',
}
