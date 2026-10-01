import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm.jsx'
import customerService from '../services/customerService.js'

const EMPTY_CUSTOMER = { name: '', email: '' }

export default function CreateCustomerPage() {
  const navigate = useNavigate()

  async function handleCreate(values) {
    const created = await customerService.create(values)
    navigate(`/customers/${created.userId}`)
  }

  return (
    <div className="stack narrow">
      <h1>Add customer</h1>
      <CustomerForm
        initialValues={EMPTY_CUSTOMER}
        submitLabel="Create customer"
        onSubmit={handleCreate}
        onCancel={() => navigate('/customers')}
      />
    </div>
  )
}
