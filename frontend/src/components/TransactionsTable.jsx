import { formatDate, formatMoney } from '../utils/format.js'

// How each transaction type from the API is shown, and whether it adds to or
// takes from the balance
const TYPES = {
  DEPOSIT: { label: 'Deposit', moneyIn: true },
  WITHDRAW: { label: 'Withdrawal', moneyIn: false },
  TRANSFER_IN: { label: 'Transfer in', moneyIn: true },
  TRANSFER_OUT: { label: 'Transfer out', moneyIn: false },
}

export default function TransactionsTable({ transactions }) {
  // newest first: transaction ids only ever go up
  const newestFirst = [...transactions].sort((a, b) => b.txnId - a.txnId)

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th className="num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {newestFirst.map((txn) => {
            const type = TYPES[txn.type] ?? { label: txn.type, moneyIn: true }
            return (
              <tr key={txn.txnId}>
                <td>{formatDate(txn.date)}</td>
                <td>{type.label}</td>
                <td className={type.moneyIn ? 'num money-in' : 'num money-out'}>
                  {type.moneyIn ? '+' : '−'}
                  {formatMoney(txn.amount)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
