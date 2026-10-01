import { Link, NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function Header({ appName }) {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          {appName}
        </Link>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/customers" className="nav-link">
              Customers
            </NavLink>
          )}
          {user?.role === 'customer' && (
            <NavLink to="/profile" className="nav-link">
              My profile
            </NavLink>
          )}
        </nav>
        <div className="session">
          {user ? (
            <>
              <span className="muted">
                Signed in as <strong>{user.name}</strong> ({user.role})
              </span>
              <button type="button" className="button button-secondary button-small" onClick={() => logout()}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Log in
              </NavLink>
              <Link to="/register" className="button button-small">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
