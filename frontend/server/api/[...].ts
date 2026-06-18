import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const backendUrl = process.env.NODE_ENV === 'production' ? 'http://backend:3001' : 'http://localhost:3001'
  
  // event.path contains the full path starting with /api (e.g. /api/auth/me?foo=bar)
  // We strip /api and append to the backend URL
  const targetPath = event.path.replace(/^\/api/, '')
  const target = `${backendUrl}${targetPath}`
  
  return proxyRequest(event, target)
})
