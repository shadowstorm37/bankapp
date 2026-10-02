import { useState } from 'react'
import useSubmit from '../hooks/useSubmit.js'
import { amountProblem } from '../utils/amount.js'
import ErrorMessage from './ErrorMessage.jsx'
import FormField from './FormField.jsx'

// An amount box and a button. Shared by deposit, withdraw and transfer: the
// parent decides the button label and what happens on submit (onSubmit gets
// the amount as text and returns a promise; if it fails, the API's message is
// shown on the form). Extra fields go in as children, with `validate`
// returning a problem with them, or null.
export default function MoneyForm({ submitLabel, onSubmit, validate, children }) {
  const [amount, setAmount] = useState('')
  const { submit, submitting, error, setError } = useSubmit(onSubmit)

  async function handleSubmit(event) {
    event.preventDefault()
    const problem = validate?.() ?? amountProblem(amount)
    if (problem) {
      setError(problem)
      return
    }
    const done = await submit(amount.trim())
    if (done) setAmount('')
  }

  return (
    <form className="form card" onSubmit={handleSubmit} noValidate>
      {error && <ErrorMessage message={error} />}
      {children}
      <FormField
        label="Amount"
        id="money-amount"
        name="amount"
        inputMode="decimal"
        autoComplete="off"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <div className="form-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Working…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
