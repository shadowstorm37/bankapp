import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CustomerTable from '../components/CustomerTable.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import SearchBox from '../components/SearchBox.jsx'
import Spinner from '../components/Spinner.jsx'
import Tabs from '../components/Tabs.jsx'
import ThresholdForm from '../components/ThresholdForm.jsx'
import useFetch from '../hooks/useFetch.js'
import { getErrorMessage } from '../services/api.js'
import customerService from '../services/customerService.js'
import { formatMoney } from '../utils/format.js'

const FILTERS = [
  { id: 'name', label: 'By first name' },
  { id: 'premium', label: 'Premium customers' },
]

// how long to wait after the last keystroke before searching
const SEARCH_DELAY_MS = 300

// Parent page: owns the data, the search and the delete logic; the table only
// displays. The search lives in the URL (/customers?firstName=j or
// /customers?filter=premium&threshold=1000), so refresh and Back keep it
export default function CustomersPage() {
  const [params, setParams] = useSearchParams()
  const filter = params.get('filter') === 'premium' ? 'premium' : 'name'
  const firstName = params.get('firstName') ?? ''
  const threshold = params.get('threshold') ?? ''
  const searchName = firstName.trim()

  // an empty box shows everyone
  const { data: customers, setData, loading, error, reload } = useFetch(
    ({ signal }) => {
      if (filter === 'premium' && threshold) return customerService.getPremium(threshold, { signal })
      if (filter === 'name' && searchName) {
        return customerService.searchByFirstName(searchName, { signal })
      }
      return customerService.getAll({ signal })
    },
    [filter, searchName, threshold],
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

  // called by SearchBox when the typing pauses. Each search replaces the last
  // one in the browser history, so Back leaves the page instead of un-typing
  function handleNameSearch(typed) {
    setParams(typed ? { firstName: typed } : {}, { replace: true })
  }

  function handleThreshold(amount) {
    setParams(amount ? { filter: 'premium', threshold: amount } : { filter: 'premium' })
  }

  // switching starts the other filter empty
  function chooseFilter(id) {
    setParams(id === 'premium' ? { filter: 'premium' } : {})
  }

  // what the table is showing, or why it's empty
  const count = customers?.length ?? 0
  const people = count === 1 ? '1 customer' : `${count} customers`
  let summary = null
  let nothingFound = 'No customers yet.'
  if (filter === 'name' && searchName) {
    summary = `${people} whose name starts with “${searchName}”`
    nothingFound = `No customers have a name starting with “${searchName}”.`
  } else if (filter === 'premium' && threshold) {
    summary = `${people} with an account holding ${formatMoney(threshold)} or more`
    nothingFound = `No customers have an account holding ${formatMoney(threshold)} or more.`
  }
  const filtered = summary !== null

  return (
    <div className="stack">
      <div className="page-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="button">
          Add customer
        </Link>
      </div>

      <Tabs label="Find customers" tabs={FILTERS} active={filter} onChange={chooseFilter} />
      {filter === 'name' ? (
        <div className="narrow">
          <SearchBox
            label="First name"
            id="search-first-name"
            hint="Type the first letters, like j or ja. Capitals don’t matter."
            value={firstName}
            onSearch={handleNameSearch}
            delayMs={SEARCH_DELAY_MS}
          />
        </div>
      ) : (
        // `key` refills the box when the URL changes (Back, or a new search)
        <ThresholdForm key={threshold} threshold={threshold} onApply={handleThreshold} />
      )}

      {error && <ErrorMessage message={error} onRetry={reload} />}
      {deleteError && <ErrorMessage message={deleteError} />}

      {/* the first load has nothing to show yet; later searches keep the old
          rows on screen until the new ones arrive */}
      {!error && !customers && <Spinner message="Loading customers…" />}
      {!error && customers && (
        <>
          {filtered && (
            <p className="muted" role="status">
              {loading ? 'Searching…' : summary}
            </p>
          )}
          {count > 0 ? (
            <CustomerTable customers={customers} deletingId={deletingId} onDelete={handleDelete} />
          ) : (
            !loading && (
              <EmptyState message={nothingFound}>
                {!filtered && (
                  <Link to="/customers/new" className="button">
                    Add the first customer
                  </Link>
                )}
              </EmptyState>
            )
          )}
        </>
      )}
    </div>
  )
}
