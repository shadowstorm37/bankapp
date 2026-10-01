import EditCustomer from '../components/EditCustomer.jsx'
import useAuth from '../hooks/useAuth.js'

// Customer: /profile/edit
export default function EditProfilePage() {
  const { user } = useAuth()
  return <EditCustomer customerId={user.userId} isOwnProfile />
}
