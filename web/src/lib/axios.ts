import axios from 'axios'
import { env } from '@/env'
export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
