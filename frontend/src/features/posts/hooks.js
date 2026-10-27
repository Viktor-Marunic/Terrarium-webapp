// React hooks for posts.
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, deletePost, getPost, listPosts, updatePost } from './api'

/**
 * One page of the feed: { posts, totalCount }. Filters by communityId / authorId when given; sort is 'new' or 'top';
 * page starts at 0. Keeps showing the previous page while the next one loads, so pagination doesn't flash.
 */
export function usePosts({ communityId, sort = 'new', authorId, page = 0 } = {}) {
  return useQuery({
    queryKey: ['posts', communityId ?? 'all', sort, authorId ?? 'everyone', page],
    queryFn: () => listPosts({ communityId, sort, authorId, page }),
    placeholderData: keepPreviousData,
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
