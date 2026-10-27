// Form for a new post: text plus optional photos. The community picker starts on defaultCommunityId (the active filter), if any.
// Calls onDone after a successful post (or on cancel).
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '../../../components/common/FormField'
import { ImagePicker } from '../../../components/common/ImagePicker'
import { createPostSchema } from '../schemas'
import { useCreatePost } from '../hooks'
import { PostTypeField } from './PostTypeField'

export function CreatePostForm({ communities, defaultCommunityId = '', onDone }) {
  const createPost = useCreatePost()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: { communityId: defaultCommunityId, type: 'showcase', title: '', body: '', images: [] },
  })

  const onSubmit = (values) => createPost.mutate(values, { onSuccess: onDone })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-4 shadow-sm" noValidate>
      <FormField label="Community" as="select" error={errors.communityId?.message} {...register('communityId')}>
        <option value="">Choose a community…</option>
        {communities.map((community) => (
          <option key={community.id} value={community.id}>
            {community.name}
          </option>
        ))}
      </FormField>
      <PostTypeField {...register('type')} />
      <FormField label="Title" error={errors.title?.message} {...register('title')} />
      <FormField label="Text (optional)" as="textarea" rows={5} error={errors.body?.message} {...register('body')} />
      <Controller
        name="images"
        control={control}
        render={({ field, fieldState }) => (
          <ImagePicker label="Photos (optional)" value={field.value} onChange={field.onChange} error={fieldState.error} />
        )}
      />
      {createPost.error && (
        <p role="alert" className="text-sm text-red-600">
          {createPost.error.message}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded-md border border-stone-300 bg-white py-2 text-stone-700 hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createPost.isPending}
          className="flex-1 rounded-md bg-emerald-700 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {createPost.isPending ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  )
}
