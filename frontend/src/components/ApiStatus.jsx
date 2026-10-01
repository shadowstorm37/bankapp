import { API_URL } from '../config.js'
import useFetch from '../hooks/useFetch.js'
import customerService from '../services/customerService.js'
import ErrorMessage from './ErrorMessage.jsx'
import Spinner from './Spinner.jsx'

// Shows whether the front end can reach the API, using the shared
// loading / error components
export default function ApiStatus() {
  const { data: customers, loading, error, reload } = useFetch(
    ({ signal }) => customerService.getAll({ signal }),
  )

  if (loading) return <Spinner message="Checking the connection to the API…" />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <p className="api-status">
      <span className="status-dot" aria-hidden="true" />
      Connected to the API at {API_URL} · {customers.length}{' '}
      {customers.length === 1 ? 'customer' : 'customers'}
    </p>
  )
}
