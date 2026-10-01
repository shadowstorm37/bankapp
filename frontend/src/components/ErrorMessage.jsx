// onRetry comes from the parent: clicking "Try again" calls back up to it
// (child -> parent communication through props)
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
