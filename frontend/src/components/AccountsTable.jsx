import { formatMoney } from '../utils/format.js'

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
              <td className="num">{account.accountId}</td>
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
