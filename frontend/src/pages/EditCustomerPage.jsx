import { useParams } from 'react-router-dom'
import EditCustomer from '../components/EditCustomer.jsx'

// Admin: /customers/:id/edit
export default function EditCustomerPage() {
  const { id } = useParams()
  return <EditCustomer customerId={id} isOwnProfile={false} />
}
