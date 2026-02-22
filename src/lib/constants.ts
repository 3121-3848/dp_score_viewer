import { ClearType, Difficulty } from '@/types'

export const CLEAR_TYPE_COLORS: Record<ClearType, { bg: string; text: string; label: string }> = {
  'FULLCOMBO CLEAR': { bg: 'bg-orange-500', text: 'text-white', label: 'FC' },
  'EX HARD CLEAR': { bg: 'bg-yellow-400', text: 'text-black', label: 'EXH' },
  'HARD CLEAR': { bg: 'bg-red-500', text: 'text-white', label: 'HARD' },
  'CLEAR': { bg: 'bg-blue-500', text: 'text-white', label: 'CLEAR' },
  'EASY CLEAR': { bg: 'bg-green-500', text: 'text-white', label: 'EASY' },
  'ASSIST CLEAR': { bg: 'bg-purple-500', text: 'text-white', label: 'ASSIST' },
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

export const VERSION_ABBREVIATIONS: Record<string, string> = {
  '1st&substream': '1st',
  '2nd style': '2nd',
  '3rd style': '3rd',
  '4th style': '4th',
  '5th style': '5th',
  '6th style': '6th',
  '7th style': '7th',
  '8th style': '8th',
  '9th style': '9th',
  '10th style': '10th',
  'IIDX RED': 'RED',
  'HAPPY SKY': 'HS',
  'DistorteD': 'DD',
  'GOLD': 'GOLD',
  'DJ TROOPERS': 'DJT',
  'EMPRESS': 'EMP',
  'SIRIUS': 'SIR',
  'Resort Anthem': 'RA',
  'Lincle': 'LC',
  'tricoro': 'tri',
  'SPADA': 'SPA',
  'PENDUAL': 'PEN',
  'copula': 'cop',
  'SINOBUZ': 'SINO',
  'CANNON BALLERS': 'CB',
  'Rootage': 'Root',
  'HEROIC VERSE': 'HV',
  'BISTROVER': 'BIS',
  'CastHour': 'CH',
  'RESIDENT': 'RES',
  'EPOLIS': 'EPO',
  'Pinky Crush': 'PC',
  'Sparkle Shower': 'SS',
}

export const CHART_COLORS: Record<ClearType, string> = {
  'FULLCOMBO CLEAR': '#f97316',
  'EX HARD CLEAR': '#facc15',
  'HARD CLEAR': '#ef4444',
  'CLEAR': '#3b82f6',
  'EASY CLEAR': '#22c55e',
  'ASSIST CLEAR': '#a855f7',
  'FAILED': '#9b9da1',
  'NO PLAY': '#d1d5db',
}
