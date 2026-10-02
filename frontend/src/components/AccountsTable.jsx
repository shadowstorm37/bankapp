import { Link } from 'react-router-dom'
import { formatMoney } from '../utils/format.js'
import { MONEY_ACTIONS } from '../utils/moneyActions.js'

// Each row has a button per money action, which opens that account's page
// (/accounts/:id) with that form showing; the account number links there too
export default function AccountsTable({ accounts }) {
  const total = accounts.reduce((sum, a) => sum + Number(a.balance), 0)

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="num">Account</th>
            <th>Type</th>
            <th className="num">Balance</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.accountId}>
              <td className="num">
                <Link to={`/accounts/${account.accountId}`}>{account.accountId}</Link>
              </td>
              <td>{account.accountType}</td>
              <td className="num">{formatMoney(account.balance)}</td>
              <td className="actions">
                {MONEY_ACTIONS.map((action) => (
                  <Link
                    key={action.id}
                    to={`/accounts/${account.accountId}?action=${action.id}`}
                    className="button button-secondary button-small"
                  >
                    {action.label}
                  </Link>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td className="num">{formatMoney(total)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
