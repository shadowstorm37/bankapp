import { Link, useNavigate } from 'react-router-dom'
import CustomerForm from './CustomerForm.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import Spinner from './Spinner.jsx'
import useAuth from '../hooks/useAuth.js'
import useFetch from '../hooks/useFetch.js'
import customerService from '../services/customerService.js'

// Same CustomerForm as the create page, started with the customer's current
// values. Used for an admin editing anyone, and a customer editing themselves
export default function EditCustomer({ customerId, isOwnProfile }) {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const { data: customer, loading, error, reload } = useFetch(
    ({ signal }) => customerService.getById(customerId, { signal }),
    [customerId],
  )
  const profilePath = isOwnProfile ? '/profile' : `/customers/${customerId}`

  async function handleSave(values) {
    const saved = await customerService.update(customerId, values)
    // keep "Signed in as …" in the header up to date
    if (isOwnProfile) updateUser({ name: saved.name, email: saved.email })
    navigate(profilePath)
  }

  if (loading) return <Spinner message="Loading profile…" />
  if (error) {
    return (
      <div className="stack">
        <ErrorMessage message={error} onRetry={reload} />
        <Link to={profilePath}>← Back</Link>
      </div>
    )
  }

  return (
    <div className="stack narrow">
      <h1>{isOwnProfile ? 'Edit my profile' : `Edit ${customer.name}`}</h1>
      <CustomerForm
        key={customer.userId}
        initialValues={{ name: customer.name, email: customer.email }}
        submitLabel="Save changes"
        onSubmit={handleSave}
        onCancel={() => navigate(profilePath)}
      />
    </div>
  )
}
