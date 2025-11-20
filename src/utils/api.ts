import axios from 'axios'

const api = axios.create({
  // @ts-expect-error baseURL no existe en el tipo AxiosRequestConfig
  baseURL: import.meta.env.VITE_API_URL, // Usar la variable del entorno
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
