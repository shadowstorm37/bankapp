import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import { homePathFor } from '../utils/homePath.js'

// `message` says why: admin-only pages use the default
export default function ForbiddenPage({ message = 'This page is for admins only.' }) {
  const { user } = useAuth()
  return (
    <div className="message-page">
      <h1>You don’t have access to this page</h1>
      <p>{message}</p>
      <Link to={homePathFor(user)} className="button">
        Go to my profile
      </Link>
    </div>
  )
}
