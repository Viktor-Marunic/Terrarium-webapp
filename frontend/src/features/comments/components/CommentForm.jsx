// Text box used for new comments, replies and edits. The parent decides what saving does:
// onSubmit(body) must return a promise (e.g. mutation.mutateAsync); the box clears when it resolves.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commentSchema } from '../schemas'

export function CommentForm({
  onSubmit,
  onCancel,
  isPending,
  error,
  label,
  submitLabel,
  defaultBody = '',
  rows = 3,
  autoFocus = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(commentSchema), defaultValues: { body: defaultBody } })

  const submit = async ({ body }) => {
    try {
      await onSubmit(body)
      reset({ body: '' })
    } catch {
      // Nothing to do here: the failed mutation's message is shown through the `error` prop.
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-2" noValidate>
      <textarea
        rows={rows}
        autoFocus={autoFocus}
        placeholder={`${label}…`}
        aria-label={label}
        aria-invalid={Boolean(errors.body)}
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
        {...register('body')}
      />
      {errors.body && <p className="text-sm text-red-600">{errors.body.message}</p>}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error.message}
        </p>
      )}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-forest-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
