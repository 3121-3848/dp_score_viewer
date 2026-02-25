import { useMemo } from 'react'
import { useScoreStore } from '@/stores/score-store'
import { VERSION_ABBREVIATIONS } from '@/lib/constants'

export function VersionFilter() {
  const chartData = useScoreStore((state) => state.chartData)
  const versionOrder = useScoreStore((state) => state.versionOrder)
  const disabledVersions = useScoreStore((state) => state.disabledVersions)
  const toggleVersion = useScoreStore((state) => state.toggleVersion)
  const enableAllVersions = useScoreStore((state) => state.enableAllVersions)
  const disableAllVersions = useScoreStore((state) => state.disableAllVersions)

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
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">バージョン</p>
        <div className="flex gap-1.5">
          <button
            onClick={enableAllVersions}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            すべて選択
          </button>
          <span className="text-xs text-gray-300">|</span>
          <button
            onClick={() => disableAllVersions(availableVersions)}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            すべて解除
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {availableVersions.map((version) => {
          const enabled = !disabledVersions.has(version)
          const label = VERSION_ABBREVIATIONS[version] ?? version
          return (
            <button
              key={version}
              onClick={() => toggleVersion(version)}
              title={version}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
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
