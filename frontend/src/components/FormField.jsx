// One labelled input; used by the login, register and customer forms
export default function FormField({ label, hint, ...inputProps }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...inputProps} />
      {hint && <small className="hint">{hint}</small>}
    </label>
  )
}
