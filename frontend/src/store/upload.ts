import { create } from 'zustand'

export interface UploadStore {
  jobId: string | null
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  outputUrl: string | null
  error: string | null
  setJobId: (id: string) => void
  setStatus: (status: UploadStore['status']) => void
  setProgress: (progress: number) => void
  setOutputUrl: (url: string) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  jobId: null,
  status: 'idle',
  progress: 0,
  outputUrl: null,
  error: null,
  setJobId: (id) => set({ jobId: id }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setOutputUrl: (url) => set({ outputUrl: url }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      jobId: null,
      status: 'idle',
      progress: 0,
      outputUrl: null,
      error: null,
    }),
}))
