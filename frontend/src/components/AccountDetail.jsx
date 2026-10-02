import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import useFetch from '../hooks/useFetch.js'
import ForbiddenPage from '../pages/ForbiddenPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import accountService from '../services/accountService.js'
import { formatMoney } from '../utils/format.js'
import EmptyState from './EmptyState.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import MoneyForm from './MoneyForm.jsx'
import Spinner from './Spinner.jsx'
import TransactionsTable from './TransactionsTable.jsx'
import TransferForm from './TransferForm.jsx'

const ACTIONS = [
  { id: 'deposit', label: 'Deposit' },
  { id: 'withdraw', label: 'Withdraw' },
  { id: 'transfer', label: 'Transfer' },
]

// One account: its balance, the deposit / withdraw / transfer forms and its
// transaction history. The API decides who may see it (the owner or an admin)
export default function AccountDetail({ accountId }) {
  const { user } = useAuth()
  const {
    data: account,
    setData: setAccount,
    loading,
    error,
    errorStatus,
    reload,
  } = useFetch(({ signal }) => accountService.getById(accountId, { signal }), [accountId])
  const history = useFetch(
    ({ signal }) => accountService.getTransactions(accountId, { signal }),
    [accountId],
  )
  const [action, setAction] = useState(ACTIONS[0].id)
  // "Deposited $50.00.", shown after a successful action
  const [confirmation, setConfirmation] = useState(null)

  // the API returns the account with its new balance; the history is fetched
  // again to pick up the new transaction
  function showResult(updatedAccount, message) {
    setAccount(updatedAccount)
    setConfirmation(message)
    history.reload()
  }

  async function handleDeposit(amount) {
    const updated = await accountService.deposit(accountId, amount)
    showResult(updated, `Deposited ${formatMoney(amount)}.`)
  }

  async function handleWithdraw(amount) {
    const updated = await accountService.withdraw(accountId, amount)
    showResult(updated, `Withdrew ${formatMoney(amount)}.`)
  }

  async function handleTransfer(toAccountId, amount) {
    const { fromAccount, toAccount } = await accountService.transfer(accountId, toAccountId, amount)
    // name the owner when the money went to someone else, as a double-check
    const owner = toAccount.userId === fromAccount.userId ? '' : ` (${toAccount.userName})`
    showResult(
      fromAccount,
      `Transferred ${formatMoney(amount)} to account ${toAccount.accountId}${owner}.`,
    )
  }

  function chooseAction(id) {
    setAction(id)
    setConfirmation(null)
  }

  if (loading) return <Spinner message="Loading account…" />
  if (errorStatus === 403) return <ForbiddenPage message="This account belongs to someone else." />
  if (errorStatus === 404) {
    return <NotFoundPage title="Account not found" message={`There's no account ${accountId}.`} />
  }
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  const isAdmin = user.role === 'admin'

  return (
    <div className="stack">
      {isAdmin ? (
        <Link to={`/customers/${account.userId}`}>← {account.userName || 'Customer'}</Link>
      ) : (
        <Link to="/profile">← My profile</Link>
      )}
      <div className="page-header">
        <div>
          <p className="eyebrow">{account.accountType}</p>
          <h1>Account {account.accountId}</h1>
          {isAdmin && <p className="muted">Owner: {account.userName}</p>}
        </div>
        <div className="balance">
          <span className="muted">Balance</span>
          <strong>{formatMoney(account.balance)}</strong>
        </div>
      </div>

      <h2>Move money</h2>
      <div className="tabs" role="group" aria-label="Move money">
        {ACTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={id === action ? 'button' : 'button button-secondary'}
            aria-pressed={id === action}
            onClick={() => chooseAction(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="stack narrow">
        {confirmation && (
          <div className="alert alert-info" role="status">
            {confirmation}
          </div>
        )}
        {/* one MoneyForm, three uses; `key` gives each its own empty form */}
        {action === 'deposit' && (
          <MoneyForm key="deposit" submitLabel="Deposit" onSubmit={handleDeposit} />
        )}
        {action === 'withdraw' && (
          <MoneyForm key="withdraw" submitLabel="Withdraw" onSubmit={handleWithdraw} />
        )}
        {action === 'transfer' && <TransferForm fromAccount={account} onSubmit={handleTransfer} />}
      </div>

      <h2>Transactions</h2>
      {history.error ? (
        <ErrorMessage message={history.error} onRetry={history.reload} />
      ) : !history.data ? (
        <Spinner message="Loading transactions…" />
      ) : history.data.length === 0 ? (
        <EmptyState message="No transactions yet." />
      ) : (
        <TransactionsTable transactions={history.data} />
      )}
    </div>
  )
}
