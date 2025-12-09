'use client'

import { useRef, useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStatus('uploading')
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: file,
      })
      const data = await response.json()
      setStatus('processing')
      setProgress(50)
    } catch (err) {
      setError('Failed to upload video')
      setStatus('failed')
    }
  }

  const handleReset = () => {
    setFileName('')
    setStatus('')
    setProgress(0)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">InfiniteFlow AI</h1>
          <p className="text-gray-300 text-lg">Frame Interpolation Engine</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Upload Area */}
          {!status && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-400 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-500/10 transition-all"
            >
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-2">Drop your video here</p>
              <p className="text-gray-300 text-sm">or click to select</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Processing Status */}
          {status && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">{fileName}</span>
                <span className="text-blue-400 text-sm font-mono">{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Status Message */}
              <div className="text-center">
                {status === 'uploading' && (
                  <p className="text-gray-300 text-sm">Uploading video...</p>
                )}
                {status === 'processing' && (
                  <p className="text-blue-300 text-sm">🔄 Processing with AI...</p>
                )}
                {status === 'completed' && (
                  <p className="text-green-300 text-sm">✓ Complete!</p>
                )}
              </div>

              {/* Reset Button */}
              {(status === 'completed' || status === 'failed') && (
                <button
                  onClick={handleReset}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Process Another Video
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            API Status: <span className="text-green-400">● Online</span>
          </p>
        </div>
      </div>
    </div>
  )
}
