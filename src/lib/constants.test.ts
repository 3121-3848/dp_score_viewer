import { describe, it, expect } from 'vitest'
import { CLEAR_TYPE_COLORS, CLEAR_TYPE_ORDER, DIFFICULTY_BADGES, CHART_COLORS } from './constants'

describe('CLEAR_TYPE_COLORS', () => {
  it('should have all clear types defined', () => {
    const clearTypes = [
      'FULLCOMBO CLEAR',
      'EX HARD CLEAR',
      'HARD CLEAR',
      'CLEAR',
      'EASY CLEAR',
      'ASSIST CLEAR',
      'FAILED',
      'NO PLAY',
    ] as const

    for (const clearType of clearTypes) {
      expect(CLEAR_TYPE_COLORS[clearType]).toBeDefined()
      expect(CLEAR_TYPE_COLORS[clearType].bg).toBeDefined()
      expect(CLEAR_TYPE_COLORS[clearType].text).toBeDefined()
      expect(CLEAR_TYPE_COLORS[clearType].label).toBeDefined()
    }
  })

  it('should have correct colors for FULLCOMBO CLEAR', () => {
    expect(CLEAR_TYPE_COLORS['FULLCOMBO CLEAR'].bg).toContain('orange')
  })

  it('should have correct colors for HARD CLEAR', () => {
    expect(CLEAR_TYPE_COLORS['HARD CLEAR'].bg).toContain('red')
  })

  it('should have correct colors for CLEAR', () => {
    expect(CLEAR_TYPE_COLORS['CLEAR'].bg).toContain('blue')
  })

  it('should have correct colors for EASY CLEAR', () => {
    expect(CLEAR_TYPE_COLORS['EASY CLEAR'].bg).toContain('green')
  })
})

describe('CLEAR_TYPE_ORDER', () => {
  it('should have all 8 clear types', () => {
    expect(CLEAR_TYPE_ORDER).toHaveLength(8)
  })

  it('should have FULLCOMBO CLEAR first', () => {
    expect(CLEAR_TYPE_ORDER[0]).toBe('FULLCOMBO CLEAR')
  })

  it('should have NO PLAY last', () => {
    expect(CLEAR_TYPE_ORDER[CLEAR_TYPE_ORDER.length - 1]).toBe('NO PLAY')
  })

  it('should have correct order', () => {
    const expectedOrder = [
      'FULLCOMBO CLEAR',
      'EX HARD CLEAR',
      'HARD CLEAR',
      'CLEAR',
      'EASY CLEAR',
      'ASSIST CLEAR',
      'FAILED',
      'NO PLAY',
    ]
    expect(CLEAR_TYPE_ORDER).toEqual(expectedOrder)
  })
})

describe('DIFFICULTY_BADGES', () => {
  it('should have all difficulty types defined', () => {
    const difficulties = ['HYPER', 'ANOTHER', 'LEGGENDARIA'] as const

    for (const diff of difficulties) {
      expect(DIFFICULTY_BADGES[diff]).toBeDefined()
      expect(DIFFICULTY_BADGES[diff].bg).toBeDefined()
      expect(DIFFICULTY_BADGES[diff].text).toBeDefined()
      expect(DIFFICULTY_BADGES[diff].label).toBeDefined()
    }
  })

  it('should have correct labels', () => {
    expect(DIFFICULTY_BADGES['HYPER'].label).toBe('H')
    expect(DIFFICULTY_BADGES['ANOTHER'].label).toBe('A')
    expect(DIFFICULTY_BADGES['LEGGENDARIA'].label).toBe('L')
  })

  it('should have HYPER as yellow', () => {
    expect(DIFFICULTY_BADGES['HYPER'].bg).toContain('yellow')
  })

  it('should have ANOTHER as red', () => {
    expect(DIFFICULTY_BADGES['ANOTHER'].bg).toContain('red')
  })

  it('should have LEGGENDARIA as purple', () => {
    expect(DIFFICULTY_BADGES['LEGGENDARIA'].bg).toContain('purple')
  })
})

describe('CHART_COLORS', () => {
  it('should have all clear types defined', () => {
    const clearTypes = [
      'FULLCOMBO CLEAR',
      'EX HARD CLEAR',
      'HARD CLEAR',
      'CLEAR',
      'EASY CLEAR',
      'ASSIST CLEAR',
      'FAILED',
      'NO PLAY',
    ] as const

    for (const clearType of clearTypes) {
      expect(CHART_COLORS[clearType]).toBeDefined()
      expect(CHART_COLORS[clearType]).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})
