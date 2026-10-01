import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import ForbiddenPage from '../pages/ForbiddenPage.jsx'

// Wraps admin-only routes (inside RequireAuth, so there's always a user).
// The API blocks these for customers anyway (403); this shows a clear page
// instead of an error
export default function RequireAdmin() {
  const { user } = useAuth()
  return user.role === 'admin' ? <Outlet /> : <ForbiddenPage />
}
