import { MONEY_FORMAT } from '../config.js'

// Currency and locale come from .env (VITE_CURRENCY, VITE_LOCALE)
export function formatMoney(amount) {
  return MONEY_FORMAT.format(Number(amount))
}
