import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface UploadResponse {
  job_id: string
  status: string
  created_at: string
}

export interface JobStatus {
  job_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  output_url?: string
  error?: string
}

export const uploadVideo = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const getJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await apiClient.get(`/api/status/${jobId}`)
  return response.data
}

export const downloadVideo = async (jobId: string): Promise<Blob> => {
  const response = await apiClient.get(`/api/download/${jobId}`, {
    responseType: 'blob',
  })
  return response.data
}

export default apiClient
