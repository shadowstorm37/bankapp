export default function Spinner({ message = 'Loading…' }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner-circle" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
