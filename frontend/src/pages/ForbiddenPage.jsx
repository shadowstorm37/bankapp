import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import { homePathFor } from '../utils/homePath.js'

export default function ForbiddenPage() {
  const { user } = useAuth()
  return (
    <div className="message-page">
      <h1>You don’t have access to this page</h1>
      <p>This page is for admins only.</p>
      <Link to={homePathFor(user)} className="button">
        Go to my profile
      </Link>
    </div>
  )
}
