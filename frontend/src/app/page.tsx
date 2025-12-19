'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { uploadVideo, getJobStatus, downloadVideo } from '../lib/api'

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStatus('uploading')
    setError(null)
    setProgress(0)
    setDownloadUrl(null)

    try {
      const upload = await uploadVideo(file)
      setJobId(upload.job_id)
      setStatus('processing')
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
    setJobId(null)
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    if (!jobId || status !== 'processing') return

    let cancelled = false
    const interval = setInterval(async () => {
      try {
        const job = await getJobStatus(jobId)
        if (cancelled) return

        setProgress(job.progress || 0)

        if (job.status === 'completed') {
          clearInterval(interval)
          setStatus('completed')
          try {
            const blob = await downloadVideo(jobId)
            if (cancelled) return
            const objectUrl = URL.createObjectURL(blob)
            setDownloadUrl(objectUrl)
          } catch (downloadErr) {
            setError('Completed, but failed to fetch download.')
          }
        }

        if (job.status === 'failed') {
          clearInterval(interval)
          setStatus('failed')
          setError(job.error || 'Processing failed')
        }
      } catch (pollErr) {
        setError('Failed to fetch status')
      }
    }, 1200)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [jobId, status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">∞</span>
            </div>
            <h1 className="text-xl font-bold text-white">InfiniteFlow</h1>
          </div>
          <span className="text-sm text-gray-400">AI Frame Interpolation</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Enhance Your Videos with AI
          </h2>
          <p className="text-xl text-gray-400">
            Upload a video and let our AI generate smooth intermediate frames
          </p>
        </div>

        {/* Main Card */}
        <div className="card rounded-3xl mb-8">
          {!status ? (
            /* Upload Section */
            <div className="text-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-400/50 rounded-2xl p-16 cursor-pointer hover:border-blue-400 hover:bg-blue-500/5 transition-all group"
              >
                <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-2">Drop your video here</h3>
                <p className="text-gray-400 mb-4">or click to browse</p>
                <p className="text-sm text-gray-500">Supported: MP4, WebM, MOV (up to 500MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            /* Processing Section */
            <div className="space-y-8">
              {/* File Info */}
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                <span className="text-white font-semibold">{fileName}</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                {status === 'uploading' && (
                  <div className="space-y-2">
                    <p className="text-blue-300 text-lg font-semibold">📤 Uploading...</p>
                    <p className="text-gray-400 text-sm">Please wait while we process your video</p>
                  </div>
                )}
                {status === 'processing' && (
                  <div className="space-y-2">
                    <p className="text-purple-300 text-lg font-semibold"> Processing with AI...</p>
                    <p className="text-gray-400 text-sm">Generating interpolated frames</p>
                  </div>
                )}
                {status === 'completed' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <p className="text-green-400 text-lg font-semibold">Complete!</p>
                    </div>
                    <p className="text-gray-400 text-sm">Your video is ready to download</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {status === 'completed' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleReset}
                    className="btn btn-secondary"
                  >
                    ↻ Process Another
                  </button>
                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      download={`optimized_${fileName || 'video'}`}
                      className="btn btn-primary text-center"
                    >
                      ⬇️ Download Video
                    </a>
                  ) : (
                    <button className="btn btn-primary" disabled>
                      Preparing download...
                    </button>
                  )}
                </div>
              )}
              {status === 'failed' && (
                <button
                  onClick={handleReset}
                  className="w-full btn btn-primary"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="card bg-red-500/10 border-red-500/50 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Features */}
        {!status && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-white mb-2">Fast</h3>
              <p className="text-gray-400 text-sm">GPU-accelerated processing</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-white mb-2">Intelligent</h3>
              <p className="text-gray-400 text-sm">AI-generated frames</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="font-bold text-white mb-2">Smooth</h3>
              <p className="text-gray-400 text-sm">2x frame rate playback</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
