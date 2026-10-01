import { useState } from 'react'
import { getErrorMessage } from '../services/api.js'
import ErrorMessage from './ErrorMessage.jsx'

// Shared by the create and edit pages. The parent decides the starting
// values, the button label, and what happens on submit (onSubmit returns a
// promise; if it fails, the API's message is shown on the form)
export default function CustomerForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name: values.name.trim(), email: values.email.trim() })
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      {error && <ErrorMessage message={error} />}
      <label className="field">
        <span>Name</span>
        <input id="customer-name" name="name" value={values.name} onChange={handleChange} required />
      </label>
      <label className="field">
        <span>Email</span>
        <input
          id="customer-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
