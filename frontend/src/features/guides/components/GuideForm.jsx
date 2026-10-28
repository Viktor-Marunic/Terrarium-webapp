// Write / edit guide form. Without `guide` it creates one; with `guide` the fields start filled in.
// Calls onSaved(guide) once the photo and row are saved, or onCancel.
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '../../../components/common/FormField'
import { CoverPhotoField } from '../../../components/common/CoverPhotoField'
import { guideCategories, guideSchema } from '../schemas'
import { useCreateGuide, useUpdateGuide } from '../hooks'

const emptyValues = { image: null, title: '', category: '', body: '' }

export function GuideForm({ guide, onSaved, onCancel }) {
  const isEditing = Boolean(guide)
  const createGuide = useCreateGuide()
  const updateGuide = useUpdateGuide()
  const save = isEditing ? updateGuide : createGuide
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(guideSchema),
    defaultValues: isEditing
      ? { image: guide.image_url, title: guide.title, category: guide.category, body: guide.body }
      : emptyValues,
  })

  const onSubmit = (values) =>
    save.mutate(isEditing ? { ...values, id: guide.id, previousImageUrl: guide.image_url } : values, { onSuccess: onSaved })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-4 shadow-sm" noValidate>
      <Controller
        name="image"
        control={control}
        render={({ field, fieldState }) => (
          <CoverPhotoField value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
        )}
      />
      <FormField label="Title" placeholder="e.g. Your first closed jar terrarium" error={errors.title?.message} {...register('title')} />
      <FormField label="Category" as="select" error={errors.category?.message} {...register('category')}>
        <option value="">Choose a category…</option>
        {guideCategories.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </FormField>
      <FormField
        label="Guide"
        as="textarea"
        rows={12}
        placeholder="Materials, step by step, tips…"
        error={errors.body?.message}
        {...register('body')}
      />
      {save.error && (
        <p role="alert" className="text-sm text-red-600">
          {save.error.message}
        </p>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-md border border-stone-300 bg-white py-2 text-stone-700 hover:bg-stone-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={save.isPending}
          className="flex-1 rounded-md bg-forest-700 py-2 font-medium text-white hover:bg-forest-800 disabled:opacity-60"
        >
          {save.isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Publish guide'}
        </button>
      </div>
    </form>
  )
}
