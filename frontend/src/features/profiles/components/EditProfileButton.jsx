// "Edit profile" button (top right of the profile page) that opens a pop-up form for name, location and bio.
// The username and picture stay as they are: the picture is generated from the username.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { Sheet } from '../../../components/common/Sheet'
import { FormField } from '../../../components/common/FormField'
import { editProfileSchema } from '../schemas'
import { useUpdateProfile } from '../hooks'

/** The form itself; mounted only while the sheet is open, so it always starts from the saved profile. */
function EditProfileForm({ profile, onDone }) {
  const updateProfile = useUpdateProfile()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { displayName: profile.display_name ?? '', location: profile.location ?? '', bio: profile.bio ?? '' },
  })

  const onSubmit = (values) => updateProfile.mutate({ id: profile.id, ...values }, { onSuccess: onDone })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
      <FormField label="Name (optional)" placeholder="e.g. Alex Larsen" error={errors.displayName?.message} {...register('displayName')} />
      <FormField label="Location (optional)" placeholder="e.g. Aarhus, Denmark" error={errors.location?.message} {...register('location')} />
      <FormField
        label="Bio"
        as="textarea"
        rows={4}
        placeholder="What do you like to build?"
        error={errors.bio?.message}
        {...register('bio')}
      />
      {updateProfile.error && (
        <p role="alert" className="text-sm text-red-600">
          {updateProfile.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={updateProfile.isPending}
        className="w-full rounded-lg bg-forest-700 py-3 font-medium text-white transition-colors hover:bg-forest-800 disabled:opacity-60"
      >
        {updateProfile.isPending ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}

export function EditProfileButton({ profile }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        // Same style as the other page-header buttons ("Sell an item", "Create an event", "Start a discussion").
        className="flex shrink-0 items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-medium text-white transition-[background-color,scale] hover:bg-forest-800 motion-safe:active:scale-[0.97]"
      >
        <PencilSimpleIcon size={18} aria-hidden="true" />
        Edit profile
      </button>
      <Sheet open={isOpen} onOpenChange={setIsOpen} title="Edit profile" description="Change your name, location and bio.">
        {isOpen && <EditProfileForm profile={profile} onDone={() => setIsOpen(false)} />}
      </Sheet>
    </>
  )
}
