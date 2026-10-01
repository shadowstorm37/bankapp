import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage.jsx'
import FormField from '../components/FormField.jsx'
import useAuth from '../hooks/useAuth.js'
import { getErrorMessage } from '../services/api.js'
import { homePathFor } from '../utils/homePath.js'

export default function LoginPage() {
  const { user, notice, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ username: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // already logged in: nothing to do here
  if (user) return <Navigate to={homePathFor(user)} replace />

  // set by RequireAuth: the page to return to after logging in
  const from = location.state?.from

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const loggedIn = await login(values)
      navigate(from ?? homePathFor(loggedIn), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <div className="stack narrow">
      <h1>Log in</h1>
      {/* why they were logged out, e.g. "Your session expired" */}
      {notice && <div className="alert alert-info">{notice}</div>}
      <form className="form card" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}
        <FormField
          label="Username"
          id="login-username"
          name="username"
          autoComplete="username"
          value={values.username}
          onChange={handleChange}
          required
        />
        <FormField
          label="Password"
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <div className="form-actions">
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </div>
      </form>
      <p className="muted">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}
