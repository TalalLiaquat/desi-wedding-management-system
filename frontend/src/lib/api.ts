import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta as ImportMeta & { env?: Record<string, string | boolean | undefined> }).env?.VITE_API_URL ?? '',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default api
