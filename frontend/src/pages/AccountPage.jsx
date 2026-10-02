import { useParams } from 'react-router-dom'
import AccountDetail from '../components/AccountDetail.jsx'
import NotFoundPage from './NotFoundPage.jsx'

// /accounts/:id - a customer's own account, or any account for an admin
export default function AccountPage() {
  const { id } = useParams()
  // account numbers are whole numbers; anything else can't exist
  if (!/^\d+$/.test(id)) return <NotFoundPage />
  // `key` starts the page fresh when the URL changes to another account
  return <AccountDetail key={id} accountId={id} />
}
