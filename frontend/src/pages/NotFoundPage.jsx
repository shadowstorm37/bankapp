import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="message-page">
      <h1>Page not found</h1>
      <p>That page doesn't exist yet.</p>
      <Link to="/" className="button">
        Back to home
      </Link>
    </div>
  )
}
