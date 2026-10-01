import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUnauthorizedHandler } from '../services/api.js'
import { clearAuth, loadAuth, saveAuth } from '../services/authStorage.js'
import authService from '../services/authService.js'
import { AuthContext } from './authContext.js'

const EXPIRED_MESSAGE = 'Your session expired. Please log in again.'

// Holds the logged-in user for the whole app (React Context), so the header
// and every page can read it without passing it down as props
export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth)
  // why the user was logged out ("session expired"), shown on the login page.
  // Kept here rather than in the redirect, because a protected page's own
  // redirect to /login (RequireAuth) can replace ours
  const [notice, setNotice] = useState(null)
  const navigate = useNavigate()

  const logout = useCallback(
    (message) => {
      clearAuth()
      setAuth(null)
      setNotice(message ?? null)
      navigate('/login', { replace: true })
    },
    [navigate],
  )

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials)
    const next = { accessToken: result.accessToken, expiresAt: result.expiresAt, user: result.user }
    saveAuth(next)
    setAuth(next)
    setNotice(null)
    return next.user
  }, [])

  // register, then log straight in with the same username and password
  const register = useCallback(
    async (details) => {
      await authService.register(details)
      return login({ username: details.username, password: details.password })
    },
    [login],
  )

  // log out automatically the moment the token expires
  useEffect(() => {
    if (!auth) return undefined
    const msLeft = Date.parse(auth.expiresAt) - Date.now()
    const timer = setTimeout(() => logout(EXPIRED_MESSAGE), Math.max(msLeft, 0))
    return () => clearTimeout(timer)
  }, [auth, logout])

  // any 401 from the API while logged in also logs out
  useEffect(() => {
    setUnauthorizedHandler((message) => {
      if (loadAuth()) logout(message)
    })
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const value = useMemo(
    () => ({ user: auth?.user ?? null, notice, login, register, logout }),
    [auth, notice, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
