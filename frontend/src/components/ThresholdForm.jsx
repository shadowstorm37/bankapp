import { useState } from 'react'
import { amountProblem } from '../utils/amount.js'
import ErrorMessage from './ErrorMessage.jsx'
import FormField from './FormField.jsx'

// The "premium customers" filter: a minimum balance and a button. `threshold`
// is the one in use (from the URL); onApply(text) is called with a checked
// amount, or '' to go back to showing everyone
export default function ThresholdForm({ threshold, onApply }) {
  const [text, setText] = useState(threshold)
  const [error, setError] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()
    const amount = text.trim()
    // an empty box means "no minimum"; zero is a valid minimum
    const problem = amount ? amountProblem(amount, { allowZero: true }) : null
    setError(problem)
    if (!problem) onApply(amount)
  }

  return (
    <form className="form narrow" onSubmit={handleSubmit} noValidate>
      {error && <ErrorMessage message={error} />}
      <FormField
        label="Minimum balance"
        id="premium-threshold"
        name="threshold"
        inputMode="decimal"
        autoComplete="off"
        hint="Shows customers with at least one account holding this much or more."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="form-actions">
        <button type="submit" className="button">
          Show
        </button>
      </div>
    </form>
  )
}
