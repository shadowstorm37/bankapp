// Keeps the login ({ accessToken, expiresAt, user }) in localStorage so a page
// refresh doesn't log the user out
const STORAGE_KEY = 'simplebank.auth'

export function loadAuth() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved?.accessToken || !saved?.expiresAt || !saved?.user) return null
    // never start "logged in" with a token that has already expired
    if (Date.parse(saved.expiresAt) <= Date.now()) {
      clearAuth()
      return null
    }
    return saved
  } catch {
    return null
  }
}

export function saveAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAccessToken() {
  return loadAuth()?.accessToken ?? null
}
