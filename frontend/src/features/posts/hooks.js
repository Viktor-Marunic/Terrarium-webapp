// React hooks for posts.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, deletePost, getPost, listPosts, updatePost } from './api'

/** All posts, or only one community's / one author's when communityId / authorId is given; sort is 'new' or 'top'. */
export function usePosts(communityId, sort = 'new', authorId) {
  return useQuery({
    queryKey: ['posts', communityId ?? 'all', sort, authorId ?? 'everyone'],
    queryFn: () => listPosts(communityId, sort, authorId),
  })
}

/** `data` is null when the post doesn't exist. */
export function usePost(id) {
  return useQuery({ queryKey: ['post', id], queryFn: () => getPost(id) })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPost,
    // Refetch every feed (all + filtered) so the new post shows up wherever the user looks.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePost,
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['post', post.id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}
