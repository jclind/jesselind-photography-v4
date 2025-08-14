import { Timestamp } from 'firebase/firestore'

export function formatTimestampDate(timestamp: any | null): string {
  if (!timestamp) return ''

  let date: Date

  // Check if it's a Firestore Timestamp
  if (typeof timestamp.toDate === 'function') {
    date = timestamp.toDate()
  } else {
    date = new Date(timestamp)
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'long', // Full month name (e.g., January)
    day: 'numeric', // Day of the month
    year: 'numeric', // Full year
  }

  return date.toLocaleDateString(undefined, options)
}
