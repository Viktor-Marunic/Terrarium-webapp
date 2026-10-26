// Zod schema for the sell form, plus the fixed category/condition lists.
// Limits and values mirror the check constraints on the listings table and the listing-images bucket.
import { z } from 'zod'

// `value` is what the database stores; `label` is what users see.
export const listingCategories = [
  { value: 'starter-kits', label: 'Starter kits' },
  { value: 'plants-moss', label: 'Plants & moss' },
  { value: 'decorations', label: 'Decorations' },
  { value: 'equipment', label: 'Equipment' },
]

export const listingConditions = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'used', label: 'Used' },
]

/** Looks up the label for a stored value, e.g. labelFor(listingConditions, 'like_new') → 'Like new'. */
export function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? value
}

export const MAX_IMAGES = 5
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const imageFile = z
  .instanceof(File)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Photos must be JPG, PNG or WebP')
  .refine((file) => file.size <= MAX_IMAGE_BYTES, 'Each photo must be 5 MB or smaller')

export const sellListingSchema = z.object({
  images: z.array(imageFile).min(1, 'Add at least one photo').max(MAX_IMAGES, `At most ${MAX_IMAGES} photos`),
  title: z.string().trim().min(3, 'At least 3 characters').max(100, 'At most 100 characters'),
  category: z.enum(
    listingCategories.map((option) => option.value),
    'Pick a category',
  ),
  condition: z.enum(
    listingConditions.map((option) => option.value),
    'Pick a condition',
  ),
  // The price input uses valueAsNumber, so an empty field arrives as NaN and fails here with this message.
  price: z.number('Enter a price').int('Whole kroner only').min(0, 'Price can’t be negative').max(100000, 'At most 100,000 kr'),
  description: z.string().trim().max(2000, 'At most 2,000 characters'),
  contactInfo: z.string().trim().min(3, 'Tell buyers how to reach you').max(200, 'At most 200 characters'),
})
