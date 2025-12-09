'use client'

import { useRef, useState, useEffect } from 'react'
import { useUploadStore } from '@/store/upload'
import { uploadVideo, getJobStatus } from '@/lib/api'
import { Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>('')
  const { jobId, status, progress, outputUrl, error, setJobId, setStatus, setProgress, setOutputUrl, setError, reset } = useUploadStore()

  useEffect(() => {
    if (!jobId || status === 'completed' || status === 'failed') return

    const interval = setInterval(async () => {
      try {
        const jobStatus = await getJobStatus(jobId)
        setStatus(jobStatus.status)
        setProgress(jobStatus.progress)
        if (jobStatus.output_url) {
          setOutputUrl(jobStatus.output_url)
        }
      } catch (err) {
        setError('Failed to fetch status')
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, status, setStatus, setProgress, setOutputUrl, setError])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStatus('uploading')
    setError(null)

    try {
      const response = await uploadVideo(file)
      setJobId(response.job_id)
      setStatus('processing')
    } catch (err) {
      setError('Failed to upload video')
      setStatus('failed')
    }
  }

  const handleDownload = () => {
    if (outputUrl) {
      const a = document.createElement('a')
      a.href = outputUrl
      a.download = `optimized-${fileName}`
      a.click()
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'failed':
        return 'text-red-500'
      case 'processing':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6" />
      case 'failed':
        return <AlertCircle className="w-6 h-6" />
      case 'processing':
        return <Loader className="w-6 h-6 animate-spin" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <h1 className="text-xl font-bold text-white">InfiniteFlow AI</h1>
          </div>
          <p className="text-sm text-slate-400">Video Frame Interpolation with AI</p>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Upload Your Video</h2>
              <p className="text-slate-300">
                Upload a video and we'll interpolate frames with AI-generated ones for smooth playback
              </p>
            </div>

            <div className="mt-8">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={status === 'processing' || status === 'uploading'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Upload className="w-5 h-5" />
                {status === 'idle' || status === 'failed' ? 'Choose Video' : 'Processing...'}
              </button>
            </div>

            {fileName && (
              <div className="mt-4 p-3 bg-slate-600/50 rounded border border-slate-500">
                <p className="text-slate-200 text-sm">
                  <span className="font-semibold">File:</span> {fileName}
                </p>
              </div>
            )}
          </div>

          {/* Status Section */}
          {status !== 'idle' && (
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className={getStatusColor()}>{getStatusIcon()}</div>
                <div>
                  <p className="font-semibold text-white capitalize">{status === 'uploading' ? 'Uploading' : status}</p>
                  {jobId && <p className="text-xs text-slate-400">ID: {jobId}</p>}
                </div>
              </div>

              {status === 'processing' && (
                <div className="space-y-2">
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-300">{progress}% complete</p>
                </div>
              )}

              {status === 'completed' && outputUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Download Optimized Video
                </button>
              )}

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {(status === 'completed' || status === 'failed') && (
                <button
                  onClick={reset}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Start Over
                </button>
              )}
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
              <p className="text-2xl font-bold text-purple-400">2x</p>
              <p className="text-sm text-slate-300">Smoother Playback</p>
            </div>
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-400">AI</p>
              <p className="text-sm text-slate-300">Generated Frames</p>
            </div>
            <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
              <p className="text-2xl font-bold text-green-400">GPU</p>
              <p className="text-sm text-slate-300">Powered Processing</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
