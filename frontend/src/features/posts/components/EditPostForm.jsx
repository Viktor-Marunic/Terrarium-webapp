// Inline form for editing your own post (type, title, text). Calls onDone after saving or on cancel.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '../../../components/common/FormField'
import { editPostSchema } from '../schemas'
import { useUpdatePost } from '../hooks'
import { PostTypeField } from './PostTypeField'

export function EditPostForm({ post, onDone }) {
  const updatePost = useUpdatePost()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editPostSchema),
    defaultValues: { type: post.type, title: post.title, body: post.body ?? '' },
  })

  const onSubmit = (values) => updatePost.mutate({ id: post.id, ...values }, { onSuccess: onDone })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-4 shadow-sm" noValidate>
      <PostTypeField {...register('type')} />
      <FormField label="Title" error={errors.title?.message} {...register('title')} />
      <FormField label="Text (optional)" as="textarea" rows={6} error={errors.body?.message} {...register('body')} />
      {updatePost.error && (
        <p role="alert" className="text-sm text-red-600">
          {updatePost.error.message}
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
          disabled={updatePost.isPending}
          className="flex-1 rounded-md bg-emerald-700 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {updatePost.isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
