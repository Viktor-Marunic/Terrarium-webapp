// Creates an account; the database trigger creates the matching profile with the chosen username.
// The username field previews the user's initials as they type, like the mockup.
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from '@phosphor-icons/react'
import { signUpSchema } from '../schemas'
import { useSignUp } from '../hooks'
import { AuthField } from './AuthField'
import { PasswordField } from './PasswordField'
import { AuthButtons } from './AuthButtons'

export function SignUpForm() {
  const signUp = useSignUp()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema), defaultValues: { username: '', acceptTerms: false } })
  // useWatch (not watch()) so only this value re-renders the preview and the React Compiler lint stays happy.
  const initials = useWatch({ control, name: 'username' }).trim().slice(0, 2).toUpperCase()

  // Email confirmation is off, so sign-up logs the user in directly and LoginPage redirects home.
  return (
    <form onSubmit={handleSubmit((values) => signUp.mutate(values))} className="space-y-5" noValidate>
      <AuthField
        label="Username"
        required
        autoComplete="username"
        autoCapitalize="none"
        placeholder="e.g. mossy_maker"
        hint="Your profile icon is created from your username."
        error={errors.username?.message}
        leading={
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-semibold text-forest-800"
          >
            {initials || '?'}
          </span>
        }
        {...register('username')}
      />
      <AuthField
        label="Email address"
        required
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        hint="For signing in. Never shown publicly."
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label="Password"
        required
        autoComplete="new-password"
        hint="Use at least 8 characters, including a number."
        error={errors.password?.message}
        {...register('password')}
      />
      <div>
        {/* Native checkbox stays (keyboard + screen readers); the styled box is drawn over it with peer-checked. */}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-600">
          <span className="relative mt-0.5 flex size-5 shrink-0">
            <input
              type="checkbox"
              className="peer size-5 cursor-pointer appearance-none rounded border border-stone-300 bg-white checked:border-forest-700 checked:bg-forest-700 focus-visible:ring-2 focus-visible:ring-forest-700/30 focus-visible:outline-none"
              aria-invalid={Boolean(errors.acceptTerms)}
              {...register('acceptTerms')}
            />
            <CheckIcon
              size={14}
              weight="bold"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 m-auto hidden text-white peer-checked:block"
            />
          </span>
          {/* The guideline/terms/privacy pages don't exist yet, so this is plain text for now. */}
          <span>I agree to the Community guidelines, Terms and Privacy policy. *</span>
        </label>
        {errors.acceptTerms && <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>}
      </div>
      {signUp.error && (
        <p role="alert" className="text-sm text-red-600">
          {signUp.error.message}
        </p>
      )}
      <AuthButtons label="Create my profile" pendingLabel="Creating your profile…" isPending={signUp.isPending} />
    </form>
  )
}
