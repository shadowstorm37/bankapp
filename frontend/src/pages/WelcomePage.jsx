import ApiStatus from '../components/ApiStatus.jsx'
import FeatureCard from '../components/FeatureCard.jsx'
import useAuth from '../hooks/useAuth.js'

// Which cards to show depends on who is looking
const CARDS = {
  guest: [
    { title: 'Sign in', description: 'Log in with your username and password.', to: '/login' },
    {
      title: 'Create an account',
      description: 'Register with a username and password to see your accounts.',
      to: '/register',
    },
  ],
  customer: [
    {
      title: 'My profile',
      description: 'See your details and your accounts, and update your name or email.',
      to: '/profile',
    },
  ],
  admin: [
    {
      title: 'Customers',
      description:
        'Browse, search, add and remove customers, and see the accounts each one owns.',
      to: '/customers',
    },
  ],
}

export default function WelcomePage() {
  const { user } = useAuth()
  const cards = CARDS[user?.role ?? 'guest']

  return (
    <div className="welcome">
      <section className="hero">
        <p className="eyebrow">{user ? `Welcome back, ${user.name}` : 'Welcome'}</p>
        <h1>Banking, in one place</h1>
        <p className="lede">
          Manage customers and their accounts, search and filter, and sign in securely.
        </p>
        <ApiStatus />
      </section>
      <section className="feature-grid">
        {cards.map((card) => (
          <FeatureCard key={card.to} title={card.title} description={card.description} to={card.to} />
        ))}
      </section>
    </div>
  )
}
