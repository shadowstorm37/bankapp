import { useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce.js'
import FormField from './FormField.jsx'

// A search-as-you-type box. It keeps what's being typed itself, so every
// letter shows immediately, and calls onSearch(text) once the typing pauses
// for delayMs. `value` is the search currently in use (the parent's copy,
// e.g. from the URL); everything else goes to FormField.
export default function SearchBox({ value, onSearch, delayMs, ...fieldProps }) {
  const [typed, setTyped] = useState(value)
  const settled = useDebounce(typed, delayMs)

  useEffect(() => {
    if (settled !== value) onSearch(settled)
    // only a pause in typing should trigger a search, not a re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled])

  // the parent's search changed without us (Back button, a link): show that
  // text instead. Our own searches come back equal to `settled` and are left
  // alone, so they can't overwrite newer typing
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    if (value !== settled) setTyped(value)
  }

  return (
    <FormField
      type="search"
      autoComplete="off"
      value={typed}
      onChange={(event) => setTyped(event.target.value)}
      {...fieldProps}
    />
  )
}
