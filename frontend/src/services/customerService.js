import api from './api.js'

// One function per /api/customers endpoint (app/api/routes/customers.py).
// Each returns the response body; `signal` lets a caller cancel the request.
const customerService = {
  getAll: ({ signal } = {}) => api.get('/api/customers', { signal }).then((r) => r.data),

  getById: (id, { signal } = {}) =>
    api.get(`/api/customers/${id}`, { signal }).then((r) => r.data),

  create: (customer) => api.post('/api/customers', customer).then((r) => r.data),

  update: (id, customer) => api.put(`/api/customers/${id}`, customer).then((r) => r.data),

  remove: (id) => api.delete(`/api/customers/${id}`).then(() => undefined),

  searchByFirstName: (firstName, { signal } = {}) =>
    api.get('/api/customers/search', { params: { firstName }, signal }).then((r) => r.data),

  getPremium: (threshold, { signal } = {}) =>
    api.get('/api/customers/premium', { params: { threshold }, signal }).then((r) => r.data),
}

export default customerService
