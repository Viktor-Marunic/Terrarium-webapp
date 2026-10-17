// Zod schema for the create-post form; limits mirror the check constraints on the posts table.
import { z } from 'zod'

export const postTypes = ['showcase', 'question']

export const createPostSchema = z.object({
  communityId: z.string().min(1, 'Pick a community'),
  type: z.enum(postTypes, 'Pick a post type'),
  title: z.string().trim().min(3, 'At least 3 characters').max(300, 'At most 300 characters'),
  body: z.string().trim().max(10000, 'At most 10,000 characters'),
})

// Editing can't move a post to another community.
export const editPostSchema = createPostSchema.omit({ communityId: true })
