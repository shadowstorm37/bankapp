// Shown in place of the app when .env is missing or incomplete
export default function ConfigError({ problems }) {
  return (
    <div className="page">
      <div className="alert alert-error" role="alert">
        <h1>The front end isn't configured</h1>
        <ul>
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
        <p>
          Copy <code>frontend/.env.example</code> to <code>frontend/.env</code>, fill it in, and
          restart <code>npm run dev</code>.
        </p>
      </div>
    </div>
  )
}
