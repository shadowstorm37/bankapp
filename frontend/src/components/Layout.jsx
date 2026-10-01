import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

const APP_NAME = 'Simple Bank'

// Parent of every page: passes appName down to Header and Footer as a prop,
// and renders the current route's page in <Outlet />
export default function Layout() {
  return (
    <div className="layout">
      <Header appName={APP_NAME} />
      <main className="page">
        <Outlet />
      </main>
      <Footer appName={APP_NAME} />
    </div>
  )
}
