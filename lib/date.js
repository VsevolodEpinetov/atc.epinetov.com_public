import { parseISO, format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { fromUnixTime } from 'date-fns'

export default function Date({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'd MMMM, yyyy', { locale: ru })}</time>
}

export function getCurrentTimestamp () {  
  return Date.now();
}

export function convertTimestampToDate (timestamp) {
  const date = fromUnixTime(timestamp / 1000);
  return <time dateTime={date}>{format(date, 'd MMMM, yyyy г., HH:mm', { locale: ru })}</time>
}


export function convertTimestampToDateInternship (timestamp) {
  const date = fromUnixTime(timestamp);
  return <time dateTime={date}>{format(date, 'd MMMM yyyy г.', { locale: ru })}</time>
}