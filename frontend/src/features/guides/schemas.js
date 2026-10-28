// Zod schema for the write/edit guide form, the category list, and small display helpers.
// Limits mirror the check constraints on the guides table.
import { z } from 'zod'
import { imageSchema } from '../../lib/images'

// `value` is stored in the database; `label` is shown on chips, cards and the form.
export const guideCategories = [
  { value: 'getting_started', label: 'Getting started' },
  { value: 'build', label: 'Builds' },
  { value: 'plant_care', label: 'Plant care' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'show_tell', label: 'Show & tell' },
]

export function guideCategoryLabel(category) {
  return guideCategories.find((option) => option.value === category)?.label ?? category
}

/** "4 min read", at roughly 200 words a minute. */
export function readingTime(body) {
  const words = body.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

export const guideSchema = z.object({
  // Optional cover photo: null (none), a newly picked File, or the current photo's URL when editing.
  image: imageSchema.nullable(),
  title: z.string().trim().min(3, 'At least 3 characters').max(120, 'At most 120 characters'),
  category: z.enum(
    guideCategories.map((option) => option.value),
    'Pick a category',
  ),
  body: z.string().trim().min(20, 'At least 20 characters').max(20000, 'At most 20,000 characters'),
})
