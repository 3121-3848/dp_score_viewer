import { useMemo } from 'react'
import { Label } from '@/components/ui/label'
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
      <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
        {availableVersions.map((version) => {
          const abbr = VERSION_ABBREVIATIONS[version]
          return (
            <label key={version} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!disabledVersions.has(version)}
                onChange={() => toggleVersion(version)}
                className="w-4 h-4 accent-gray-800"
              />
              <Label className="cursor-pointer font-normal leading-none">
                {abbr ? <><span className="font-mono text-xs text-gray-400 w-8 inline-block">{abbr}</span>{version}</> : version}
              </Label>
            </label>
          )
        })}
      </div>
    </div>
  )
}
