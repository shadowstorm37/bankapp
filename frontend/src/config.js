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

const currency = env.VITE_CURRENCY?.trim()
const locale = env.VITE_LOCALE?.trim()
if (!currency) problems.push('VITE_CURRENCY is not set')
if (!locale) problems.push('VITE_LOCALE is not set')

// Intl throws on an unknown currency or locale, so check them once here
let moneyFormat = null
let dateFormat = null
if (currency && locale) {
  try {
    moneyFormat = new Intl.NumberFormat(locale, { style: 'currency', currency })
    dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    problems.push(`VITE_CURRENCY "${currency}" or VITE_LOCALE "${locale}" isn't valid`)
  }
}

export const configProblems = problems
export const MONEY_FORMAT = moneyFormat
export const DATE_FORMAT = dateFormat
export const API_URL = apiUrl ? apiUrl.replace(/\/+$/, '') : ''
export const API_TIMEOUT_MS = timeoutMs
