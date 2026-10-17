// Zod schema for the comment/reply form; limit mirrors the check constraint on comments.body.
import { z } from 'zod'

export const commentSchema = z.object({
  body: z.string().trim().min(1, 'Write something first').max(5000, 'At most 5,000 characters'),
})
