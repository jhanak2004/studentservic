import axios from 'axios'

// In development, an empty base URL keeps requests on Vite's /api proxy.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export default api
