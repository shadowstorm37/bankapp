import api from './api.js'

// One function per /api/accounts endpoint used by the front end
// (app/api/routes/accounts.py)
const accountService = {
  getAll: ({ signal } = {}) => api.get('/api/accounts', { signal }).then((r) => r.data),

  getById: (id, { signal } = {}) =>
    api.get(`/api/accounts/${id}`, { signal }).then((r) => r.data),

  getTransactions: (id, { signal } = {}) =>
    api.get(`/api/accounts/${id}/transactions`, { signal }).then((r) => r.data),
}

export default accountService
