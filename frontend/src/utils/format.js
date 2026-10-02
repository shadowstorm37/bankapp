import { DATE_FORMAT, MONEY_FORMAT } from '../config.js'

// Currency and locale come from .env (VITE_CURRENCY, VITE_LOCALE)
export function formatMoney(amount) {
  return MONEY_FORMAT.format(Number(amount))
}

// The API sends dates as ISO text ("2026-10-01T19:58:00Z"); shown in the
// user's own time zone
export function formatDate(isoDate) {
  return DATE_FORMAT.format(new Date(isoDate))
}
