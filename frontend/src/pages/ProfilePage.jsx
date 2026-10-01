import CustomerProfile from '../components/CustomerProfile.jsx'
import useAuth from '../hooks/useAuth.js'

// Customer: /profile shows the logged-in user's own details and accounts
export default function ProfilePage() {
  const { user } = useAuth()
  return <CustomerProfile customerId={user.userId} isOwnProfile />
}
