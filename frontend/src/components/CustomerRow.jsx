import { useState } from 'react'
import { Link } from 'react-router-dom'

// One table row. Asks for confirmation inline, then hands the delete up to
// the parent through onDelete (child -> parent)
export default function CustomerRow({ customer, deleting, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <tr>
      <td className="num">{customer.userId}</td>
      <td>{customer.name}</td>
      <td>{customer.email}</td>
      <td className="actions">
        {deleting ? (
          <span className="muted">Deleting…</span>
        ) : confirming ? (
          <span className="confirm">
            Delete {customer.name}?
            <button
              type="button"
              className="button button-danger button-small"
              onClick={() => {
                setConfirming(false)
                onDelete(customer)
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </span>
        ) : (
          <>
            <Link to={`/customers/${customer.userId}`} className="button button-secondary button-small">
              View
            </Link>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={() => setConfirming(true)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  )
}
