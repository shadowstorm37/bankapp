import { useParams } from 'react-router-dom'
import CustomerProfile from '../components/CustomerProfile.jsx'

// Admin: /customers/:id
export default function CustomerDetailPage() {
  const { id } = useParams()
  return <CustomerProfile customerId={id} isOwnProfile={false} />
}
