import api from './api.js'

// GET /api/health (app/api/routes/health.py) - public, no login needed
const healthService = {
  check: ({ signal } = {}) => api.get('/api/health', { signal }).then((r) => r.data),
}

export default healthService
