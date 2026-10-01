import { Link } from 'react-router-dom'
import AccountsTable from './AccountsTable.jsx'
import EmptyState from './EmptyState.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import Spinner from './Spinner.jsx'
import useFetch from '../hooks/useFetch.js'
import customerService from '../services/customerService.js'

// A customer's details and accounts. Used by two pages through props:
// an admin viewing /customers/:id, and a customer viewing their own /profile
export default function CustomerProfile({ customerId, isOwnProfile }) {
  // the customer and their accounts load together; refetches if the id changes
  const { data, loading, error, reload } = useFetch(
    ({ signal }) =>
      Promise.all([
        customerService.getById(customerId, { signal }),
        customerService.getAccounts(customerId, { signal }),
      ]),
    [customerId],
  )

  const backLink = !isOwnProfile && <Link to="/customers">← All customers</Link>
  const editPath = isOwnProfile ? '/profile/edit' : `/customers/${customerId}/edit`

  if (loading) return <Spinner message="Loading profile…" />
  if (error) {
    return (
      <div className="stack">
        <ErrorMessage message={error} onRetry={reload} />
        {backLink}
      </div>
    )
  }

  const [customer, accounts] = data

  return (
    <div className="stack">
      {backLink}
      <div className="page-header">
        <div>
          {isOwnProfile && <p className="eyebrow">My profile</p>}
          <h1>{customer.name}</h1>
          <p className="muted">
            Customer {customer.userId} · {customer.email}
          </p>
        </div>
        <Link to={editPath} className="button button-secondary">
          Edit
        </Link>
      </div>

      <h2>{isOwnProfile ? 'My accounts' : 'Accounts'}</h2>
      {accounts.length === 0 ? (
        <EmptyState
          message={isOwnProfile ? 'You don’t have any accounts yet. An admin can open one for you.' : 'No accounts yet.'}
        />
      ) : (
        <AccountsTable accounts={accounts} />
      )}
    </div>
  )
}
