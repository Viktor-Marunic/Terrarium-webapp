// React hooks for comments.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createComment, deleteComment, listComments, updateComment } from './api'

export function useComments(postId) {
  return useQuery({ queryKey: ['comments', postId], queryFn: () => listComments(postId) })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createComment,
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.post_id] })
      // Feeds show a comment count per post.
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (comment) => queryClient.invalidateQueries({ queryKey: ['comments', comment.post_id] }),
  })
}

/** Call with { id, postId }; postId is only needed to refresh the right thread. */
export function useDeleteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => deleteComment(id),
    onSuccess: (_data, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
