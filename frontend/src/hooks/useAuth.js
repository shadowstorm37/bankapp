import { useContext } from 'react'
import { AuthContext } from '../context/authContext.js'

// Any component can call useAuth() to get { user, notice, login, register, logout }
export default function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return auth
}
