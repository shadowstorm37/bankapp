import { useState } from 'react'
import { Link } from 'react-router-dom'
import CustomerTable from '../components/CustomerTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Spinner from '../components/Spinner.jsx'
import useFetch from '../hooks/useFetch.js'
import { getErrorMessage } from '../services/api.js'
import customerService from '../services/customerService.js'

// Parent page: owns the data and the delete logic; the table only displays
export default function CustomersPage() {
  const { data: customers, setData, loading, error, reload } = useFetch(({ signal }) =>
    customerService.getAll({ signal }),
  )
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  // called by CustomerRow (through CustomerTable) after the user confirms
  async function handleDelete(customer) {
    setDeletingId(customer.userId)
    setDeleteError(null)
    try {
      await customerService.remove(customer.userId)
      setData((list) => list.filter((c) => c.userId !== customer.userId))
    } catch (err) {
      setDeleteError(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="stack">
      <div className="page-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="button">
          Add customer
        </Link>
      </div>

      {loading && <Spinner message="Loading customers…" />}
      {error && <ErrorMessage message={error} onRetry={reload} />}
      {deleteError && <ErrorMessage message={deleteError} />}

      {!loading && !error && customers.length === 0 && (
        <EmptyState message="No customers yet.">
          <Link to="/customers/new" className="button">
            Add the first customer
          </Link>
        </EmptyState>
      )}
      {!loading && !error && customers.length > 0 && (
        <CustomerTable customers={customers} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  )
}
