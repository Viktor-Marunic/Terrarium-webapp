// "Add to calendar": builds a standard .ics file for an event and downloads it. Phones and desktop calendar
// apps (Apple, Google, Outlook) all open .ics files, so no calendar API or account linking is needed.

/** Date → "20261024T090000Z" (UTC, the iCalendar basic format). */
function toIcsDate(isoString) {
  return new Date(isoString).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Escapes the characters iCalendar treats specially in text values. */
function escapeIcs(text) {
  return String(text ?? '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (match) => `\\${match}`)
}

export function downloadEventIcs(event) {
  const location = [event.place, event.address].filter(Boolean).join(', ')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TerraSpace//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@terraspace`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(event.starts_at)}`,
    `DTEND:${toIcsDate(event.ends_at)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  // The spec wants CRLF line endings.
  const file = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(file)
  // A temporary download link (a file download, not navigation, so React Router isn't involved).
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title.replace(/[^\w-]+/g, '-').toLowerCase()}.ics`
  link.click()
  URL.revokeObjectURL(url)
}
