// One labelled dropdown; the <option>s are passed in as children
export default function SelectField({ label, hint, children, ...selectProps }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...selectProps}>{children}</select>
      {hint && <small className="hint">{hint}</small>}
    </label>
  )
}
