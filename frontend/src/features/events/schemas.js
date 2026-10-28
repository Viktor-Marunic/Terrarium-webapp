// Zod schema for the create/edit event form, the event type list, and small display helpers.
// Limits mirror the check constraints on the events table and the event-images bucket.
import { z } from 'zod'
import { format } from 'date-fns'

// `value` is stored in the database; `filter` labels the chip row, `label` the small caps line on cards.
export const eventTypes = [
  { value: 'workshop', filter: 'Workshops', label: 'Terrarium workshop' },
  { value: 'plant_swap', filter: 'Plant swaps', label: 'Plant swap' },
  { value: 'meetup', filter: 'Meetups', label: 'Community meetup' },
]

export function eventTypeLabel(type) {
  return eventTypes.find((option) => option.value === type)?.label ?? type
}

/** "Free" or "DKK 95", like the mockup. Display only: there are no payments. */
export function formatEventPrice(price) {
  return price === 0 ? 'Free' : `DKK ${price}`
}

/** "11:00–12:30" in the viewer's time zone. */
export function formatEventTime(event) {
  return `${format(new Date(event.starts_at), 'HH:mm')}–${format(new Date(event.ends_at), 'HH:mm')}`
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

// The photo is optional: null (none), a newly picked File, or the URL string of the current photo when editing.
const eventImage = z
  .custom((image) => image === null || typeof image === 'string' || image instanceof File, 'Invalid photo')
  .refine((image) => !(image instanceof File) || ACCEPTED_IMAGE_TYPES.includes(image.type), 'Photos must be JPG, PNG or WebP')
  .refine((image) => !(image instanceof File) || image.size <= MAX_IMAGE_BYTES, 'The photo must be 5 MB or smaller')

export const eventSchema = z
  .object({
    image: eventImage,
    title: z.string().trim().min(3, 'At least 3 characters').max(100, 'At most 100 characters'),
    type: z.enum(
      eventTypes.map((option) => option.value),
      'Pick a type',
    ),
    // Native date/time inputs give "2026-10-24" and "11:00"; api.js turns them into timestamps.
    date: z.string().min(1, 'Pick a date'),
    startTime: z.string().min(1, 'Pick a start time'),
    endTime: z.string().min(1, 'Pick an end time'),
    place: z.string().trim().min(2, 'Where is it?').max(100, 'At most 100 characters'),
    address: z.string().trim().max(200, 'At most 200 characters'),
    // Number inputs use valueAsNumber: empty price arrives as NaN and fails; empty capacity (NaN) means "no limit".
    price: z.number('Enter a price (0 for free)').int('Whole kroner only').min(0, 'Can’t be negative').max(10000, 'At most 10,000'),
    capacity: z.union([z.nan(), z.number().int('Whole number').min(1, 'At least 1').max(1000, 'At most 1,000')]),
    description: z.string().trim().max(2000, 'At most 2,000 characters'),
  })
  // "HH:mm" strings compare correctly as text, so no Date parsing is needed here.
  .refine((values) => !values.startTime || !values.endTime || values.endTime > values.startTime, {
    message: 'Must end after it starts',
    path: ['endTime'],
  })
