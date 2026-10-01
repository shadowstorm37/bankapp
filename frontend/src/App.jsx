import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CreateCustomerPage from './pages/CreateCustomerPage.jsx'
import CustomerDetailPage from './pages/CustomerDetailPage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import EditCustomerPage from './pages/EditCustomerPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'

// Every page renders inside Layout (header + page + footer)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<WelcomePage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/new" element={<CreateCustomerPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="customers/:id/edit" element={<EditCustomerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
