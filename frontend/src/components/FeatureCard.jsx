import { Link } from 'react-router-dom'

// Reusable child: the parent decides the content through props
export default function FeatureCard({ title, description, to }) {
  return (
    <Link to={to} className="card feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  )
}
