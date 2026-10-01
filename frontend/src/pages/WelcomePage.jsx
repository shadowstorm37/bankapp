import ApiStatus from '../components/ApiStatus.jsx'
import FeatureCard from '../components/FeatureCard.jsx'

const FEATURES = [
  {
    title: 'Customers',
    description: 'Browse, add and remove customers, and see the accounts each one owns.',
    to: '/customers',
  },
  {
    title: 'Search',
    description: 'Find customers by first name, or list premium customers above a balance.',
    to: '/search',
  },
  {
    title: 'Sign in',
    description: 'Register with a username and password, then log in.',
    to: '/login',
  },
]

export default function WelcomePage() {
  return (
    <div className="welcome">
      <section className="hero">
        <p className="eyebrow">Welcome</p>
        <h1>Banking, in one place</h1>
        <p className="lede">
          Manage customers and their accounts, search and filter, and sign in securely.
        </p>
        <ApiStatus />
      </section>
      <section className="feature-grid">
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.to}
            title={feature.title}
            description={feature.description}
            to={feature.to}
          />
        ))}
      </section>
    </div>
  )
}
