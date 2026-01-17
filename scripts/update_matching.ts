import Fuse from 'fuse.js'
import * as fs from 'fs'
import * as path from 'path'
import Papa from 'papaparse'

interface DifficultyEntry {
  version: string
  title: string
  hyper: { official: number | null; unofficial: number | null } | null
  another: { official: number | null; unofficial: number | null } | null
  leggendaria: { official: number | null; unofficial: number | null } | null
}

interface DifficultyTable {
  [title: string]: DifficultyEntry
}

interface MatchingTable {
  [csvTitle: string]: string
}

function loadDifficultyTable(): DifficultyTable {
  const filePath = path.join(process.cwd(), 'difficulty_table', 'difficulty_table.json')
  if (!fs.existsSync(filePath)) {
    console.error('Difficulty table not found. Run update:table first.')
    process.exit(1)
  }
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

function loadCSVTitles(): string[] {
  const exampleDir = path.join(process.cwd(), 'example_input')
  if (!fs.existsSync(exampleDir)) {
    console.error('example_input directory not found')
    process.exit(1)
  }

  const titles = new Set<string>()

  const files = fs.readdirSync(exampleDir).filter((f) => f.endsWith('.csv'))
  for (const file of files) {
    const filePath = path.join(exampleDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const result = Papa.parse<{ タイトル: string }>(content, {
      header: true,
      skipEmptyLines: true,
    })

    for (const row of result.data) {
      if (row['タイトル']) {
        titles.add(row['タイトル'])
      }
    }
  }

  return Array.from(titles)
}

function generateMatchingTable(
  difficultyTable: DifficultyTable,
  csvTitles: string[]
): MatchingTable {
  const tableTitles = Object.keys(difficultyTable)
  const matching: MatchingTable = {}

  // Set up Fuse.js for fuzzy matching
  const fuse = new Fuse(tableTitles, {
    threshold: 0.3,
    includeScore: true,
  })

  for (const csvTitle of csvTitles) {
    // Skip if exact match exists
    if (difficultyTable[csvTitle]) {
      continue
    }

    // Try fuzzy matching
    const results = fuse.search(csvTitle)
    if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.3) {
      const matchedTitle = results[0].item
      matching[csvTitle] = matchedTitle
      console.log(`Matched: "${csvTitle}" -> "${matchedTitle}" (score: ${results[0].score?.toFixed(3)})`)
    }
  }

  return matching
}

function main() {
  console.log('Loading difficulty table...')
  const difficultyTable = loadDifficultyTable()
  console.log(`Loaded ${Object.keys(difficultyTable).length} entries from difficulty table`)

  console.log('Loading CSV titles...')
  const csvTitles = loadCSVTitles()
  console.log(`Found ${csvTitles.length} unique titles in CSV files`)

  console.log('Generating matching table...')
  const matchingTable = generateMatchingTable(difficultyTable, csvTitles)
  console.log(`Created ${Object.keys(matchingTable).length} fuzzy matches`)

  // Save to matching_table directory
  const outputDir = path.join(process.cwd(), 'matching_table')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(outputDir, 'matching_table.json')
  fs.writeFileSync(outputPath, JSON.stringify(matchingTable, null, 2), 'utf-8')
  console.log(`Saved to: ${outputPath}`)

  // Also copy to public/data for the web app
  const publicDataDir = path.join(process.cwd(), 'public', 'data')
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true })
  }

  const publicOutputPath = path.join(publicDataDir, 'matching_table.json')
  fs.writeFileSync(publicOutputPath, JSON.stringify(matchingTable, null, 2), 'utf-8')
  console.log(`Copied to: ${publicOutputPath}`)
}

main()
