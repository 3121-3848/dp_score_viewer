import { DifficultyTable, MatchingTable } from '@/types'

const BASE_URL = import.meta.env.BASE_URL || '/'

export async function loadDifficultyTable(): Promise<DifficultyTable> {
  try {
    const response = await fetch(`${BASE_URL}data/difficulty_table.json`)
    if (!response.ok) {
      console.warn('Failed to load difficulty table')
      return {}
    }
    return await response.json()
  } catch (error) {
    console.warn('Error loading difficulty table:', error)
    return {}
  }
}

export async function loadMatchingTable(): Promise<MatchingTable> {
  try {
    const response = await fetch(`${BASE_URL}data/matching_table.json`)
    if (!response.ok) {
      console.warn('Failed to load matching table')
      return {}
    }
    return await response.json()
  } catch (error) {
    console.warn('Error loading matching table:', error)
    return {}
  }
}

export async function loadVersionOrder(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}data/version_order.json`)
    if (!response.ok) {
      console.warn('Failed to load version order')
      return []
    }
    return await response.json()
  } catch (error) {
    console.warn('Error loading version order:', error)
    return []
  }
}
