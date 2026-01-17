import { describe, it, expect } from 'vitest'
import { parseCSV } from './csv-parser'

describe('parseCSV', () => {
  it('should parse a valid CSV row', () => {
    const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
1st&substream,5.1.1.,PIANO AMBIENT,dj nagureo,0,0,0,0,0,---,NO PLAY,---,1,0,0,0,---,HARD CLEAR,---,7,0,0,0,---,NO PLAY,---,10,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-09-17 21:25`

    const result = parseCSV(csv)

    expect(result).toHaveLength(1)
    expect(result[0].version).toBe('1st&substream')
    expect(result[0].title).toBe('5.1.1.')
    expect(result[0].genre).toBe('PIANO AMBIENT')
    expect(result[0].artist).toBe('dj nagureo')
    expect(result[0].lastPlayDate).toBe('2025-09-17 21:25')
  })

  it('should parse HYPER chart data correctly', () => {
    const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
5th style,sometime,SOUND TRACK,Aya,1,0,0,0,0,---,NO PLAY,---,5,0,0,0,---,NO PLAY,---,8,801,304,193,78,EASY CLEAR,B,8,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-12-26 19:05`

    const result = parseCSV(csv)

    expect(result[0].hyper).not.toBeNull()
    expect(result[0].hyper?.difficulty).toBe(8)
    expect(result[0].hyper?.score).toBe(801)
    expect(result[0].hyper?.pgreat).toBe(304)
    expect(result[0].hyper?.great).toBe(193)
    expect(result[0].hyper?.missCount).toBe(78)
    expect(result[0].hyper?.clearType).toBe('EASY CLEAR')
    expect(result[0].hyper?.djLevel).toBe('B')
  })

  it('should parse ANOTHER chart data correctly', () => {
    const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
4th style,Clione,DUTCH TRANCE,kors k,1,0,0,0,0,---,NO PLAY,---,3,0,0,0,---,NO PLAY,---,4,0,0,0,---,NO PLAY,---,9,908,325,258,200,FAILED,C,11,0,0,0,---,NO PLAY,---,2025-12-24 15:32`

    const result = parseCSV(csv)

    expect(result[0].another).not.toBeNull()
    expect(result[0].another?.difficulty).toBe(9)
    expect(result[0].another?.score).toBe(908)
    expect(result[0].another?.clearType).toBe('FAILED')
    expect(result[0].another?.djLevel).toBe('C')
    expect(result[0].another?.missCount).toBe(200)
  })

  it('should handle NO PLAY clear type', () => {
    const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
1st&substream,5.1.1.,PIANO AMBIENT,dj nagureo,0,0,0,0,0,---,NO PLAY,---,1,0,0,0,---,NO PLAY,---,7,0,0,0,---,NO PLAY,---,10,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-09-17 21:25`

    const result = parseCSV(csv)

    expect(result[0].hyper?.clearType).toBe('NO PLAY')
    expect(result[0].another?.clearType).toBe('NO PLAY')
  })

  it('should handle null miss count (---)', () => {
    const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
1st&substream,5.1.1.,PIANO AMBIENT,dj nagureo,0,0,0,0,0,---,NO PLAY,---,1,0,0,0,---,NO PLAY,---,7,0,0,0,---,NO PLAY,---,10,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-09-17 21:25`

    const result = parseCSV(csv)

    expect(result[0].hyper?.missCount).toBeNull()
  })

  it('should parse multiple rows', () => {
    const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
1st&substream,5.1.1.,PIANO AMBIENT,dj nagureo,0,0,0,0,0,---,NO PLAY,---,1,0,0,0,---,HARD CLEAR,---,7,0,0,0,---,NO PLAY,---,10,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-09-17 21:25
1st&substream,GAMBOL,BIG BEAT,SLAKE,0,0,0,0,0,---,NO PLAY,---,2,0,0,0,---,HARD CLEAR,---,2,0,0,0,---,HARD CLEAR,---,0,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-09-17 21:25`

    const result = parseCSV(csv)

    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('5.1.1.')
    expect(result[1].title).toBe('GAMBOL')
  })

  it('should handle different clear types', () => {
    const clearTypes = [
      { input: 'FULLCOMBO CLEAR', expected: 'FULLCOMBO CLEAR' },
      { input: 'EX HARD CLEAR', expected: 'EX HARD CLEAR' },
      { input: 'HARD CLEAR', expected: 'HARD CLEAR' },
      { input: 'CLEAR', expected: 'CLEAR' },
      { input: 'EASY CLEAR', expected: 'EASY CLEAR' },
      { input: 'ASSIST CLEAR', expected: 'ASSIST CLEAR' },
      { input: 'FAILED', expected: 'FAILED' },
      { input: 'NO PLAY', expected: 'NO PLAY' },
    ]

    for (const { input, expected } of clearTypes) {
      const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時
test,test,test,test,0,0,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,8,100,50,50,10,${input},B,0,0,0,0,---,NO PLAY,---,0,0,0,0,---,NO PLAY,---,2025-01-01`

      const result = parseCSV(csv)
      expect(result[0].hyper?.clearType).toBe(expected)
    }
  })

  it('should return empty array for empty CSV', () => {
    const result = parseCSV('')
    expect(result).toHaveLength(0)
  })

  it('should return empty array for header-only CSV', () => {
    const csv = `バージョン,タイトル,ジャンル,アーティスト,プレー回数,BEGINNER 難易度,BEGINNER スコア,BEGINNER PGreat,BEGINNER Great,BEGINNER ミスカウント,BEGINNER クリアタイプ,BEGINNER DJ LEVEL,NORMAL 難易度,NORMAL スコア,NORMAL PGreat,NORMAL Great,NORMAL ミスカウント,NORMAL クリアタイプ,NORMAL DJ LEVEL,HYPER 難易度,HYPER スコア,HYPER PGreat,HYPER Great,HYPER ミスカウント,HYPER クリアタイプ,HYPER DJ LEVEL,ANOTHER 難易度,ANOTHER スコア,ANOTHER PGreat,ANOTHER Great,ANOTHER ミスカウント,ANOTHER クリアタイプ,ANOTHER DJ LEVEL,LEGGENDARIA 難易度,LEGGENDARIA スコア,LEGGENDARIA PGreat,LEGGENDARIA Great,LEGGENDARIA ミスカウント,LEGGENDARIA クリアタイプ,LEGGENDARIA DJ LEVEL,最終プレー日時`

    const result = parseCSV(csv)
    expect(result).toHaveLength(0)
  })
})
