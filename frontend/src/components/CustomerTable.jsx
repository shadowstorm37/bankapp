import CustomerRow from './CustomerRow.jsx'

// Receives the list and the delete handler from its parent page as props
export default function CustomerTable({ customers, deletingId, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="num">ID</th>
            <th>Name</th>
            <th>Email</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <CustomerRow
              key={customer.userId}
              customer={customer}
              deleting={deletingId === customer.userId}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
