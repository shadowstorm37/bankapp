// computed once when the app loads, not on every render
const YEAR = new Date().getFullYear()

export default function Footer({ appName }) {
  return (
    <footer className="footer">
      <p>
        © {YEAR} {appName} · React front end for the FastAPI + MongoDB API
      </p>
    </footer>
  )
}
