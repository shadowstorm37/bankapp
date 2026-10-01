// The only file that reads .env. Every setting is required: nothing falls back
// to a value written in the code.
const env = import.meta.env

const problems = []

const apiUrl = env.VITE_API_URL?.trim()
if (!apiUrl) {
  problems.push('VITE_API_URL is not set')
}

const timeoutMs = Number(env.VITE_API_TIMEOUT_MS)
if (!env.VITE_API_TIMEOUT_MS) {
  problems.push('VITE_API_TIMEOUT_MS is not set')
} else if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
  problems.push('VITE_API_TIMEOUT_MS must be a whole number of milliseconds')
}

export const configProblems = problems
export const API_URL = apiUrl ? apiUrl.replace(/\/+$/, '') : ''
export const API_TIMEOUT_MS = timeoutMs
