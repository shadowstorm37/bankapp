// Checks what a user typed into an amount box before it goes to the API.
// Returns a sentence describing the problem, or null if the amount is fine.
// Zero is refused unless allowZero is set (a minimum balance can be zero).
export function amountProblem(text, { allowZero = false } = {}) {
  const amount = text.trim()
  if (!amount) return 'Enter an amount.'
  // digits, optionally followed by a point and one or two more digits
  if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    return 'Enter the amount as a number with at most two decimal places, like 50 or 50.25.'
  }
  if (!allowZero && Number(amount) <= 0) return 'The amount must be more than zero.'
  return null
}
