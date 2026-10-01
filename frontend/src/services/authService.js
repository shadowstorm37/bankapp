import api from './api.js'

// /api/auth endpoints (app/api/routes/auth.py)
const authService = {
  // { name, email, username, password } -> the new customer
  register: (details) => api.post('/api/auth/register', details).then((r) => r.data),

  // { username, password } -> the customer, or a 401 error
  login: (credentials) => api.post('/api/auth/login', credentials).then((r) => r.data),
}

export default authService
