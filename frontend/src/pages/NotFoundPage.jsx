import { Link } from 'react-router-dom'

export default function NotFoundPage({
  title = 'Page not found',
  message = "That page doesn't exist yet.",
}) {
  return (
    <div className="message-page">
      <h1>{title}</h1>
      <p>{message}</p>
      <Link to="/" className="button">
        Back to home
      </Link>
    </div>
  )
}
