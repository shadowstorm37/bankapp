import { Link } from 'react-router-dom'
import { formatMoney } from '../utils/format.js'

// Each account number links to that account's page (/accounts/:id)
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
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td className="num">{formatMoney(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
