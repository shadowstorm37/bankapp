import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage.jsx'
import FormField from '../components/FormField.jsx'
import useAuth from '../hooks/useAuth.js'
import { getErrorMessage } from '../services/api.js'
import { homePathFor } from '../utils/homePath.js'

const EMPTY = { name: '', email: '', username: '', password: '', confirmPassword: '' }

// The same rules the API enforces (app/schemas/auth.py), checked here first so
// mistakes show instantly. The API still checks everything itself.
function validate(values) {
  if (!/^[A-Za-z0-9._-]{3,30}$/.test(values.username)) {
    return 'Username must be 3–30 characters: letters, numbers, dots, dashes or underscores.'
  }
  if (values.password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (new TextEncoder().encode(values.password).length > 72) {
    return 'Password is too long (72 bytes at most).'
  }
  if (values.password !== values.confirmPassword) {
    return "Passwords don't match."
  }
  return null
}

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (user) return <Navigate to={homePathFor(user)} replace />

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const problem = validate(values)
    if (problem) {
      setError(problem)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      // confirmPassword is only for this form; the API doesn't take it
      const { confirmPassword: _, ...details } = values
      const loggedIn = await register({ ...details, name: details.name.trim(), email: details.email.trim() })
      navigate(homePathFor(loggedIn), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <div className="stack narrow">
      <h1>Create an account</h1>
      <form className="form card" onSubmit={handleSubmit} noValidate>
        {error && <ErrorMessage message={error} />}
        <FormField label="Name" id="register-name" name="name" autoComplete="name"
          value={values.name} onChange={handleChange} required />
        <FormField label="Email" id="register-email" name="email" type="email" autoComplete="email"
          value={values.email} onChange={handleChange} required />
        <FormField label="Username" id="register-username" name="username" autoComplete="username"
          hint="3–30 characters: letters, numbers, . _ -"
          value={values.username} onChange={handleChange} required />
        <FormField label="Password" id="register-password" name="password" type="password"
          autoComplete="new-password" hint="At least 8 characters"
          value={values.password} onChange={handleChange} required />
        <FormField label="Confirm password" id="register-confirm" name="confirmPassword" type="password"
          autoComplete="new-password"
          value={values.confirmPassword} onChange={handleChange} required />
        <div className="form-actions">
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </div>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
