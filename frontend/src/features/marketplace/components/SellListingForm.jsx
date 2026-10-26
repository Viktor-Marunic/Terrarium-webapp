// "Sell an item" form: photos, details, price and how buyers can reach the seller.
// Calls onCreated(listing) after the photos are uploaded and the listing is saved, or onCancel.
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '../../../components/common/FormField'
import { listingCategories, listingConditions, sellListingSchema } from '../schemas'
import { useCreateListing } from '../hooks'
import { ImagePicker } from './ImagePicker'

/** First message for the photo list: a list-level one ("Add at least one photo") or the first bad file's. */
function imagesError(error) {
  if (!error) return undefined
  return error.message ?? error.find?.((fileError) => fileError)?.message
}

export function SellListingForm({ onCreated, onCancel }) {
  const createListing = useCreateListing()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sellListingSchema),
    defaultValues: { images: [], title: '', category: '', condition: '', price: NaN, description: '', contactInfo: '' },
  })

  const onSubmit = (values) => createListing.mutate(values, { onSuccess: onCreated })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-4 shadow-sm" noValidate>
      <Controller
        name="images"
        control={control}
        render={({ field, fieldState }) => (
          <ImagePicker value={field.value} onChange={field.onChange} error={imagesError(fieldState.error)} />
        )}
      />
      <FormField label="Title" placeholder="e.g. Woodland starter kit" error={errors.title?.message} {...register('title')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" as="select" error={errors.category?.message} {...register('category')}>
          <option value="">Choose a category…</option>
          {listingCategories.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>
        <FormField label="Condition" as="select" error={errors.condition?.message} {...register('condition')}>
          <option value="">Choose a condition…</option>
          {listingConditions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </FormField>
      </div>
      <FormField
        label="Price (kr)"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        error={errors.price?.message}
        {...register('price', { valueAsNumber: true })}
      />
      <FormField
        label="Description (optional)"
        as="textarea"
        rows={4}
        placeholder="Size, what's included, pickup or shipping…"
        error={errors.description?.message}
        {...register('description')}
      />
      <FormField
        label="How can buyers reach you?"
        placeholder="Email or phone number"
        error={errors.contactInfo?.message}
        {...register('contactInfo')}
      />
      <p className="-mt-2 text-xs text-stone-500">Shown to logged-in users who tap “Contact seller”.</p>
      {createListing.error && (
        <p role="alert" className="text-sm text-red-600">
          {createListing.error.message}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-stone-300 bg-white py-2 text-stone-700 hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createListing.isPending}
          className="flex-1 rounded-md bg-emerald-700 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {createListing.isPending ? 'Publishing…' : 'Publish listing'}
        </button>
      </div>
    </form>
  )
}
