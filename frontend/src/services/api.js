import axios from 'axios'
import { API_TIMEOUT_MS, API_URL } from '../config.js'
import { getAccessToken } from './authStorage.js'

// One Axios instance shared by every service, so the address, headers and
// timeout are set in one place
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
})

// Before every request: attach the login token, if there is one
api.interceptors.request.use((request) => {
  const token = getAccessToken()
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

// The auth context registers a function here to run when the API says the
// login is no longer valid (expired token, deleted user)
let onUnauthorized = null
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

// After every response: a 401 means "log in again" - except on the login
// request itself, where it just means a wrong username or password
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url === '/api/auth/login'
    if (error.response?.status === 401 && !isLoginRequest && onUnauthorized) {
      onUnauthorized(getErrorMessage(error))
    }
    return Promise.reject(error)
  },
)

export default api

// Turns any failed request into one sentence a user can read
export function getErrorMessage(error) {
  if (axios.isCancel(error)) {
    return null
  }
  if (error.code === 'ECONNABORTED') {
    return `The server at ${API_URL} took too long to respond.`
  }
  if (!error.response) {
    return `Can't reach the server at ${API_URL}. Is the API running?`
  }

  const { status, data } = error.response
  // business-rule errors from the API: {"error": "message"}
  if (data?.error) {
    return data.error
  }
  // validation errors from FastAPI (422): {"detail": [{loc, msg}, ...]}
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((d) => `${d.loc?.[d.loc.length - 1] ?? 'input'}: ${d.msg}`)
      .join('; ')
  }
  return `Request failed (${status}).`
}
