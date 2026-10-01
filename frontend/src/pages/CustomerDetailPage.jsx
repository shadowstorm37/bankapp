import { Link, useParams } from 'react-router-dom'
import AccountsTable from '../components/AccountsTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Spinner from '../components/Spinner.jsx'
import useFetch from '../hooks/useFetch.js'
import customerService from '../services/customerService.js'

export default function CustomerDetailPage() {
  const { id } = useParams()
  // the customer and their accounts load together; [id] refetches if the URL changes
  const { data, loading, error, reload } = useFetch(
    ({ signal }) =>
      Promise.all([
        customerService.getById(id, { signal }),
        customerService.getAccounts(id, { signal }),
      ]),
    [id],
  )

  if (loading) return <Spinner message="Loading customer…" />
  if (error) {
    return (
      <div className="stack">
        <ErrorMessage message={error} onRetry={reload} />
        <Link to="/customers">← All customers</Link>
      </div>
    )
  }

  const [customer, accounts] = data

  return (
    <div className="stack">
      <Link to="/customers">← All customers</Link>
      <div className="page-header">
        <div>
          <h1>{customer.name}</h1>
          <p className="muted">
            Customer {customer.userId} · {customer.email}
          </p>
        </div>
        <Link to={`/customers/${customer.userId}/edit`} className="button button-secondary">
          Edit
        </Link>
      </div>

      <h2>Accounts</h2>
      {accounts.length === 0 ? (
        <EmptyState message="No accounts yet." />
      ) : (
        <AccountsTable accounts={accounts} />
      )}
    </div>
  )
}
