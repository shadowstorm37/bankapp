import { Link, NavLink } from 'react-router-dom'

const NAV_LINKS = [{ to: '/', label: 'Home' }]

export default function Header({ appName }) {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          {appName}
        </Link>
        <nav className="nav">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
