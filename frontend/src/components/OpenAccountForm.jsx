import { useState } from 'react'
import useSubmit from '../hooks/useSubmit.js'
import accountService from '../services/accountService.js'
import { ACCOUNT_TYPES } from '../utils/accountTypes.js'
import ErrorMessage from './ErrorMessage.jsx'
import SelectField from './SelectField.jsx'

// Admin only: opens an empty account for a customer. onOpened receives the
// new account, so the parent can add it to its list
export default function OpenAccountForm({ customerId, onOpened }) {
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES[0])
  const { submit, submitting, error } = useSubmit(async () => {
    onOpened(await accountService.create(Number(customerId), accountType))
  })

  function handleSubmit(event) {
    event.preventDefault()
    submit()
  }

  return (
    <form className="form card narrow" onSubmit={handleSubmit}>
      <h3>Open an account</h3>
      {error && <ErrorMessage message={error} />}
      <SelectField
        label="Account type"
        id="open-account-type"
        value={accountType}
        onChange={(event) => setAccountType(event.target.value)}
      >
        {ACCOUNT_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </SelectField>
      <div className="form-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Opening…' : 'Open account'}
        </button>
      </div>
    </form>
  )
}
