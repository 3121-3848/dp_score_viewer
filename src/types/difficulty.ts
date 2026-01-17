export interface DifficultyEntry {
  version: string
  title: string
  hyper: {
    official: number | null
    unofficial: number | null
  } | null
  another: {
    official: number | null
    unofficial: number | null
  } | null
  leggendaria: {
    official: number | null
    unofficial: number | null
  } | null
}

export interface DifficultyTable {
  [title: string]: DifficultyEntry
}

export interface MatchingTable {
  [csvTitle: string]: string
}
