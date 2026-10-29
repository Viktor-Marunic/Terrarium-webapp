// Zod schema for the write/edit guide form, the category and level lists, and small display helpers.
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

export const guideLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function guideCategoryLabel(category) {
  return guideCategories.find((option) => option.value === category)?.label ?? category
}

export function guideLevelLabel(level) {
  return guideLevels.find((option) => option.value === level)?.label ?? level
}

/** "4 min read" for the intro plus every step, at roughly 200 words a minute. */
export function readingTime(guide) {
  const text = [guide.body, ...guide.steps.map((step) => `${step.title} ${step.text}`)].join(' ')
  const words = text.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

const MAX_ITEMS = 30

/** A blank step for the form (new guides start with one; "Add step" appends another). */
export const emptyStep = { title: '', text: '' }

export const guideSchema = z.object({
  // Optional cover photo: null (none), a newly picked File, or the current photo's URL when editing.
  image: imageSchema.nullable(),
  title: z.string().trim().min(3, 'At least 3 characters').max(120, 'At most 120 characters'),
  category: z.enum(
    guideCategories.map((option) => option.value),
    'Pick a category',
  ),
  level: z.enum(
    guideLevels.map((option) => option.value),
    'Pick a level',
  ),
  // The intro, stored in the body column. Same limit as the database, since older guides kept their whole text here.
  body: z.string().trim().min(20, 'At least 20 characters').max(20000, 'At most 20,000 characters'),
  // Typed one per line; saved as a list without the empty lines.
  materials: z
    .string()
    .transform((text) => text.split('\n').map((line) => line.trim()).filter(Boolean))
    .pipe(z.array(z.string()).min(1, 'Add at least one item').max(MAX_ITEMS, `At most ${MAX_ITEMS} items`))
    // A refine on the whole list (not .max per item), so the message shows under the one textarea.
    .refine((items) => items.every((item) => item.length <= 200), 'Each item at most 200 characters'),
  steps: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Give the step a title').max(80, 'At most 80 characters'),
        text: z.string().trim().min(1, 'Describe the step').max(1000, 'At most 1,000 characters'),
      }),
    )
    .min(1, 'Add at least one step')
    .max(MAX_ITEMS, `At most ${MAX_ITEMS} steps`),
})
