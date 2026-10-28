// Create / edit event form. Without `event` it creates one; with `event` the fields start filled in.
// Calls onSaved(event) once the photo and row are saved, or onCancel.
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { FormField } from '../../../components/common/FormField'
import { CoverPhotoField } from '../../../components/common/CoverPhotoField'
import { eventSchema, eventTypes } from '../schemas'
import { useCreateEvent, useUpdateEvent } from '../hooks'

const emptyValues = {
  image: null, title: '', type: '', date: '', startTime: '', endTime: '',
  place: '', address: '', price: 0, capacity: NaN, description: '',
}

/** A saved event → form values (the reverse of toEventRow in api.js), in the user's own time zone. */
function toFormValues(event) {
  return {
    image: event.image_url,
    title: event.title,
    type: event.type,
    date: format(new Date(event.starts_at), 'yyyy-MM-dd'),
    startTime: format(new Date(event.starts_at), 'HH:mm'),
    endTime: format(new Date(event.ends_at), 'HH:mm'),
    place: event.place,
    address: event.address ?? '',
    price: event.price,
    capacity: event.capacity ?? NaN,
    description: event.description ?? '',
  }
}

export function EventForm({ event, onSaved, onCancel }) {
  const isEditing = Boolean(event)
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const save = isEditing ? updateEvent : createEvent
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(eventSchema), defaultValues: isEditing ? toFormValues(event) : emptyValues })

  const onSubmit = (values) =>
    save.mutate(isEditing ? { ...values, id: event.id, previousImageUrl: event.image_url } : values, { onSuccess: onSaved })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-4 shadow-sm" noValidate>
      <Controller
        name="image"
        control={control}
        render={({ field, fieldState }) => (
          <CoverPhotoField value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
        )}
      />
      <FormField label="Title" placeholder="e.g. Cuttings & coffee at Dokk1" error={errors.title?.message} {...register('title')} />
      <FormField label="Type" as="select" error={errors.type?.message} {...register('type')}>
        <option value="">Choose a type…</option>
        {eventTypes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </FormField>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-1">
          <FormField label="Date" type="date" error={errors.date?.message} {...register('date')} />
        </div>
        <FormField label="Starts" type="time" error={errors.startTime?.message} {...register('startTime')} />
        <FormField label="Ends" type="time" error={errors.endTime?.message} {...register('endTime')} />
      </div>
      <FormField label="Place" placeholder="e.g. Dokk1 · outdoor harbour steps" error={errors.place?.message} {...register('place')} />
      <FormField label="Address (optional)" placeholder="Street, city" error={errors.address?.message} {...register('address')} />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Price (DKK, 0 = free)"
          type="number"
          inputMode="numeric"
          min="0"
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
        <FormField
          label="Max spots (optional)"
          type="number"
          inputMode="numeric"
          min="1"
          placeholder="No limit"
          error={errors.capacity?.message}
          {...register('capacity', { valueAsNumber: true })}
        />
      </div>
      <FormField
        label="About (optional)"
        as="textarea"
        rows={4}
        placeholder="What to bring, who it's for…"
        error={errors.description?.message}
        {...register('description')}
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
          {save.isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Create event'}
        </button>
      </div>
    </form>
  )
}
