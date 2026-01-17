import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as path from 'path'

interface DifficultyInfo {
  official: number | null
  unofficial: number | null
}

interface DifficultyEntry {
  version: string
  title: string
  hyper: DifficultyInfo | null
  another: DifficultyInfo | null
  leggendaria: DifficultyInfo | null
}

interface DifficultyTable {
  [title: string]: DifficultyEntry
}

function parseDifficultyCell(cell: string): DifficultyInfo | null {
  if (!cell || cell.trim() === '' || cell.trim() === '-') return null

  // Format: ☆8 (8.5) or just ☆8
  const match = cell.match(/☆(\d+)(?:\s*\((\d+(?:\.\d+)?)\))?/)
  if (!match) return null

  return {
    official: parseInt(match[1], 10),
    unofficial: match[2] ? parseFloat(match[2]) : null,
  }
}

async function fetchDifficultyTable(): Promise<{ table: DifficultyTable; versionOrder: string[] }> {
  const url = 'https://zasa.sakura.ne.jp/dp/run.php'

  console.log('Fetching difficulty table from:', url)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  const table: DifficultyTable = {}
  const versionOrder: string[] = []
  let currentVersion = ''

  $('table.run tr').each((_, row) => {
    const thCells = $(row).find('th')
    const tdCells = $(row).find('td')

    // Check if this is a version header row (th with colspan="4")
    if (thCells.length === 1) {
      const colspan = thCells.attr('colspan')
      if (colspan && parseInt(colspan, 10) >= 4) {
        const versionText = thCells.text().trim()
        // Skip the "Sparkle Shower ALL MUSIC" header or similar top-level headers
        if (!versionText.includes('ALL MUSIC') && !versionText.includes('Sparkle Shower')) {
          currentVersion = versionText
          if (!versionOrder.includes(currentVersion)) {
            versionOrder.push(currentVersion)
          }
        }
        return
      }
    }

    // Regular data row: HYPER | ANOTHER | LEGGENDARIA | Title
    if (tdCells.length >= 4) {
      const hyperText = $(tdCells[0]).text().trim()
      const anotherText = $(tdCells[1]).text().trim()
      const leggendariaText = $(tdCells[2]).text().trim()
      const title = $(tdCells[3]).text().trim()

      if (!title) return

      const hyper = parseDifficultyCell(hyperText)
      const another = parseDifficultyCell(anotherText)
      const leggendaria = parseDifficultyCell(leggendariaText)

      // Only add if at least one difficulty is present
      if (hyper || another || leggendaria) {
        table[title] = {
          version: currentVersion,
          title,
          hyper,
          another,
          leggendaria,
        }
      }
    }
  })

  return { table, versionOrder }
}

async function main() {
  try {
    const { table, versionOrder } = await fetchDifficultyTable()
    const entryCount = Object.keys(table).length

    console.log(`Parsed ${entryCount} entries`)
    console.log(`Found ${versionOrder.length} versions:`, versionOrder.slice(0, 5).join(', '), '...')

    // Save to difficulty_table directory
    const outputDir = path.join(process.cwd(), 'difficulty_table')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputPath = path.join(outputDir, 'difficulty_table.json')
    fs.writeFileSync(outputPath, JSON.stringify(table, null, 2), 'utf-8')
    console.log(`Saved table to: ${outputPath}`)

    const versionOrderPath = path.join(outputDir, 'version_order.json')
    fs.writeFileSync(versionOrderPath, JSON.stringify(versionOrder, null, 2), 'utf-8')
    console.log(`Saved version order to: ${versionOrderPath}`)

    // Also copy to public/data for the web app
    const publicDataDir = path.join(process.cwd(), 'public', 'data')
    if (!fs.existsSync(publicDataDir)) {
      fs.mkdirSync(publicDataDir, { recursive: true })
    }

    const publicOutputPath = path.join(publicDataDir, 'difficulty_table.json')
    fs.writeFileSync(publicOutputPath, JSON.stringify(table, null, 2), 'utf-8')
    console.log(`Copied table to: ${publicOutputPath}`)

    const publicVersionOrderPath = path.join(publicDataDir, 'version_order.json')
    fs.writeFileSync(publicVersionOrderPath, JSON.stringify(versionOrder, null, 2), 'utf-8')
    console.log(`Copied version order to: ${publicVersionOrderPath}`)

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
