// Zod schema for the "Edit profile" form. Limits mirror the check constraints on the profiles table.
import { z } from 'zod'

export const editProfileSchema = z.object({
  displayName: z.string().trim().max(50, 'At most 50 characters'),
  location: z.string().trim().max(60, 'At most 60 characters'),
  bio: z.string().trim().max(500, 'At most 500 characters'),
})
