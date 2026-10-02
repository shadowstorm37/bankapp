import { useState } from 'react'
import { getErrorMessage } from '../services/api.js'

// The "submitting" and "error" state every form needs. `action` is the async
// function to run on submit; submit(...) passes its arguments through and
// resolves to true if it worked, false if it failed (the API's message is
// then in `error`). setError lets a form show its own validation message.
export default function useSubmit(action) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function submit(...args) {
    setSubmitting(true)
    setError(null)
    try {
      await action(...args)
      return true
    } catch (err) {
      setError(getErrorMessage(err))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { submit, submitting, error, setError }
}
