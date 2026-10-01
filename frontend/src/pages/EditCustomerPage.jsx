import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Spinner from '../components/Spinner.jsx'
import useFetch from '../hooks/useFetch.js'
import customerService from '../services/customerService.js'

// Same CustomerForm as the create page, started with the customer's current values
export default function EditCustomerPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: customer, loading, error, reload } = useFetch(
    ({ signal }) => customerService.getById(id, { signal }),
    [id],
  )

  async function handleSave(values) {
    await customerService.update(id, values)
    navigate(`/customers/${id}`)
  }

  if (loading) return <Spinner message="Loading customer…" />
  if (error) {
    return (
      <div className="stack">
        <ErrorMessage message={error} onRetry={reload} />
        <Link to="/customers">← All customers</Link>
      </div>
    )
  }

  return (
    <div className="stack narrow">
      <h1>Edit {customer.name}</h1>
      <CustomerForm
        key={customer.userId}
        initialValues={{ name: customer.name, email: customer.email }}
        submitLabel="Save changes"
        onSubmit={handleSave}
        onCancel={() => navigate(`/customers/${id}`)}
      />
    </div>
  )
}
