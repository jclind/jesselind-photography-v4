import { Timestamp } from 'firebase/firestore'

export function formatTimestampDate(timestamp: Timestamp | null): string {
  if (!timestamp) return ''

  const date = timestamp.toDate() // Convert Firestore Timestamp to JS Date
  const options: Intl.DateTimeFormatOptions = {
    month: 'long', // Full month name (e.g., January)
    day: 'numeric', // Day of the month
    year: 'numeric', // Full year
  }

  return date.toLocaleDateString(undefined, options)
}
