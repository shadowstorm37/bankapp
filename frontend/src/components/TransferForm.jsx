import { useState } from 'react'
import useFetch from '../hooks/useFetch.js'
import customerService from '../services/customerService.js'
import { formatMoney } from '../utils/format.js'
import FormField from './FormField.jsx'
import MoneyForm from './MoneyForm.jsx'
import SelectField from './SelectField.jsx'

// dropdown choice that swaps in a box for typing any account number
const ANOTHER_ACCOUNT = 'another'

// MoneyForm plus a "To" field: one of the owner's other accounts, picked by
// type and balance so nobody has to remember account numbers, or any other
// account by number. onSubmit(toAccountId, amount) returns a promise.
export default function TransferForm({ fromAccount, onSubmit }) {
  // the owner's accounts, minus the one the money is leaving
  const { data, reload } = useFetch(
    ({ signal }) => customerService.getAccounts(fromAccount.userId, { signal }),
    [fromAccount.userId],
  )
  const otherAccounts = (data ?? []).filter((a) => a.accountId !== fromAccount.accountId)

  const [choice, setChoice] = useState('')
  const [typedNumber, setTypedNumber] = useState('')

  // with no other accounts to pick from, go straight to the number box
  const typing = choice === ANOTHER_ACCOUNT || otherAccounts.length === 0
  const toAccountId = typing ? typedNumber.trim() : choice

  function validate() {
    if (!typing && !choice) return 'Choose the account to transfer to.'
    if (typing && !/^\d+$/.test(toAccountId)) return 'Enter the account number to transfer to.'
    return null
  }

  async function handleSubmit(amount) {
    await onSubmit(Number(toAccountId), amount)
    // the balances shown in the dropdown have changed
    reload()
  }

  return (
    <MoneyForm submitLabel="Transfer" onSubmit={handleSubmit} validate={validate}>
      {otherAccounts.length > 0 && (
        <SelectField
          label="To"
          id="transfer-to"
          value={choice}
          onChange={(event) => setChoice(event.target.value)}
        >
          <option value="">Choose an account…</option>
          {otherAccounts.map((a) => (
            <option key={a.accountId} value={a.accountId}>
              {a.accountType} · account {a.accountId} · {formatMoney(a.balance)}
            </option>
          ))}
          <option value={ANOTHER_ACCOUNT}>Another account number…</option>
        </SelectField>
      )}
      {typing && (
        <FormField
          label={otherAccounts.length > 0 ? 'Account number' : 'To account number'}
          id="transfer-to-number"
          inputMode="numeric"
          autoComplete="off"
          value={typedNumber}
          onChange={(event) => setTypedNumber(event.target.value)}
        />
      )}
    </MoneyForm>
  )
}
