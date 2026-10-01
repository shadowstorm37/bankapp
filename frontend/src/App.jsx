import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import CreateCustomerPage from './pages/CreateCustomerPage.jsx'
import CustomerDetailPage from './pages/CustomerDetailPage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import EditCustomerPage from './pages/EditCustomerPage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'

// Every page renders inside Layout (header + page + footer)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<WelcomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* everything below needs a login */}
        <Route element={<RequireAuth />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          {/* admins only */}
          <Route element={<RequireAdmin />}>
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/new" element={<CreateCustomerPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="customers/:id/edit" element={<EditCustomerPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
