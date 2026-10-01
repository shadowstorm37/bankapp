import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../services/api.js'

// Runs fetchFn when the component appears and whenever `deps` change.
// fetchFn receives { signal } and should pass it to the service call, so a
// request that's no longer needed (page left, deps changed) gets cancelled.
export default function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchFn({ signal: controller.signal })
      .then((result) => setData(result))
      .catch((err) => {
        const message = getErrorMessage(err)
        // null means the request was cancelled on purpose: not an error
        if (message) setError(message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
    // fetchFn is usually an inline arrow function, so it changes every render;
    // the caller's deps decide when to refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  // lets a "Try again" button run the same request again
  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  // setData lets a page update what it shows (e.g. remove a deleted row)
  // without fetching everything again
  return { data, setData, loading, error, reload }
}
