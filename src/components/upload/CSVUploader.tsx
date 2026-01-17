import { useCallback, useState } from 'react'
import { Upload, Clipboard, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useScoreStore } from '@/stores/score-store'

const BASE_URL = import.meta.env.BASE_URL || '/'

export function CSVUploader() {
  const loadCSV = useScoreStore((state) => state.loadCSV)
  const [isDragging, setIsDragging] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [isLoadingSample, setIsLoadingSample] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        if (text) {
          loadCSV(text)
        }
      }
      reader.readAsText(file)
    },
    [loadCSV]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.name.endsWith('.csv')) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handlePaste = useCallback(() => {
    if (pasteText.trim()) {
      loadCSV(pasteText)
      setPasteText('')
    }
  }, [pasteText, loadCSV])

  const handleLoadSample = useCallback(async () => {
    setIsLoadingSample(true)
    try {
      const response = await fetch(`${BASE_URL}data/sample_score.csv`)
      if (response.ok) {
        const text = await response.text()
        loadCSV(text)
      }
    } catch (error) {
      console.error('Failed to load sample data:', error)
    } finally {
      setIsLoadingSample(false)
    }
  }, [loadCSV])

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <Button
            onClick={handleLoadSample}
            disabled={isLoadingSample}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
          >
            <Database className="h-5 w-5 mr-2" />
            {isLoadingSample ? '読み込み中...' : 'サンプルデータをロード'}
          </Button>
          <p className="text-center text-sm text-blue-600 mt-2">
            まずはサンプルデータで機能をお試しください
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>スコアデータを読み込む</CardTitle>
          <CardDescription>
            公式サイトからダウンロードしたCSVファイルをアップロードするか、貼り付けてください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">CSVファイルをドラッグ&ドロップ</p>
            <p className="text-gray-400 text-sm mb-4">または</p>
            <label>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button variant="outline" asChild>
                <span className="cursor-pointer">ファイルを選択</span>
              </Button>
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">または</span>
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              className="w-full h-32 p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CSVデータを貼り付け..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <Button onClick={handlePaste} disabled={!pasteText.trim()} className="w-full">
              <Clipboard className="h-4 w-4 mr-2" />
              貼り付けたデータを読み込む
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
