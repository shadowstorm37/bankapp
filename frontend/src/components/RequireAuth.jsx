import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

// Wraps routes that need a login. Logged-out visitors go to /login, which
// sends them back here afterwards - unless they got here by logging out, when
// the next login (maybe someone else's) starts at that user's home page
export default function RequireAuth() {
  const { user, loggedOut } = useAuth()
  const location = useLocation()

  if (!user) {
    const state = loggedOut ? null : { from: location.pathname }
    return <Navigate to="/login" replace state={state} />
  }
  return <Outlet />
}
