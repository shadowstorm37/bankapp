export default function EmptyState({ message, children }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {children}
    </div>
  )
}
