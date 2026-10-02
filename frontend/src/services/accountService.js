import api from './api.js'

// One function per /api/accounts endpoint used by the front end
// (app/api/routes/accounts.py). Amounts are sent as text ("50.25") so the
// API's Decimal gets the exact value.
const accountService = {
  getAll: ({ signal } = {}) => api.get('/api/accounts', { signal }).then((r) => r.data),

  getById: (id, { signal } = {}) =>
    api.get(`/api/accounts/${id}`, { signal }).then((r) => r.data),

  getTransactions: (id, { signal } = {}) =>
    api.get(`/api/accounts/${id}/transactions`, { signal }).then((r) => r.data),

  // admin only: opens an empty account for a customer
  create: (userId, accountType) =>
    api.post('/api/accounts', { userId, accountType }).then((r) => r.data),

  // both return the account with its new balance
  deposit: (id, amount) =>
    api.post(`/api/accounts/${id}/deposit`, { amount }).then((r) => r.data),

  withdraw: (id, amount) =>
    api.post(`/api/accounts/${id}/withdraw`, { amount }).then((r) => r.data),

  // -> { fromAccount, toAccount }; toAccount.balance is null unless the
  // caller owns the destination or is an admin
  transfer: (id, toAccountId, amount) =>
    api.post(`/api/accounts/${id}/transfer`, { toAccountId, amount }).then((r) => r.data),
}

export default accountService
