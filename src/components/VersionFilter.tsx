import { useMemo } from 'react'
import { useScoreStore } from '@/stores/score-store'
import { VERSION_ABBREVIATIONS } from '@/lib/constants'

export function VersionFilter() {
  const chartData = useScoreStore((state) => state.chartData)
  const versionOrder = useScoreStore((state) => state.versionOrder)
  const disabledVersions = useScoreStore((state) => state.disabledVersions)
  const toggleVersion = useScoreStore((state) => state.toggleVersion)

  const availableVersions = useMemo(() => {
    const versionSet = new Set(chartData.map((c) => c.version).filter(Boolean))
    const versionIndexMap = new Map(versionOrder.map((v, i) => [v, i]))
    return Array.from(versionSet).sort((a, b) => {
      const ai = versionIndexMap.get(a) ?? 9999
      const bi = versionIndexMap.get(b) ?? 9999
      return ai - bi
    })
  }, [chartData, versionOrder])

  if (availableVersions.length === 0) return null

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">バージョン</p>
      <div className="flex flex-wrap gap-1.5">
        {availableVersions.map((version) => {
          const enabled = !disabledVersions.has(version)
          const label = VERSION_ABBREVIATIONS[version] ?? version
          return (
            <button
              key={version}
              onClick={() => toggleVersion(version)}
              title={version}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                enabled
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
