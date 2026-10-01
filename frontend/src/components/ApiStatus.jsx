import { API_URL } from '../config.js'
import useFetch from '../hooks/useFetch.js'
import healthService from '../services/healthService.js'
import ErrorMessage from './ErrorMessage.jsx'
import Spinner from './Spinner.jsx'

// Shows whether the front end can reach the API (GET /api/health, no login
// needed), using the shared loading / error components
export default function ApiStatus() {
  const { loading, error, reload } = useFetch(({ signal }) => healthService.check({ signal }))

  if (loading) return <Spinner message="Checking the connection to the API…" />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <p className="api-status">
      <span className="status-dot" aria-hidden="true" />
      Connected to the API at {API_URL}
    </p>
  )
}
