// Zod schemas for the login and sign-up forms.
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})

// Username rule mirrors the check constraint on profiles.username, so users see the error before the database rejects it.
export const signUpSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,20}$/, '3–20 characters: letters, numbers or _'),
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})
