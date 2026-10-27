// Listing form: photos, details, price and how buyers can reach the seller.
// Without `listing` it's the "Sell an item" form; with `listing` it edits that listing (fields start filled in,
// already-uploaded photos are kept as URLs). Calls onSaved(listing) once photos and row are saved, or onCancel.
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '../../../components/common/FormField'
import { listingCategories, listingConditions, listingSchema } from '../schemas'
import { useCreateListing, useUpdateListing } from '../hooks'
import { ImagePicker } from '../../../components/common/ImagePicker'

const emptyValues = { images: [], title: '', category: '', condition: '', price: NaN, description: '', contactInfo: '' }

/** A saved listing → form values (the reverse of toListingRow in api.js). */
function toFormValues(listing) {
  return {
    images: listing.image_urls,
    title: listing.title,
    category: listing.category,
    condition: listing.condition,
    price: listing.price,
    description: listing.description ?? '',
    contactInfo: listing.contact_info,
  }
}

export function ListingForm({ listing, onSaved, onCancel }) {
  const isEditing = Boolean(listing)
  const createListing = useCreateListing()
  const updateListing = useUpdateListing()
  const save = isEditing ? updateListing : createListing
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: isEditing ? toFormValues(listing) : emptyValues,
  })

  const onSubmit = (values) =>
    save.mutate(isEditing ? { ...values, id: listing.id, previousImageUrls: listing.image_urls } : values, {
      onSuccess: onSaved,
    })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-4 shadow-sm" noValidate>
      <Controller
        name="images"
        control={control}
        render={({ field, fieldState }) => (
          <ImagePicker value={field.value} onChange={field.onChange} error={fieldState.error} />
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
      {save.error && (
        <p role="alert" className="text-sm text-red-600">
          {save.error.message}
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
          disabled={save.isPending}
          className="flex-1 rounded-md bg-emerald-700 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {save.isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Publish listing'}
        </button>
      </div>
    </form>
  )
}
