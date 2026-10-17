// Creates an account; the database trigger creates the matching profile with the chosen username.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from '../schemas'
import { useSignUp } from '../hooks'
import { FormField } from './FormField'

export function SignUpForm() {
  const signUp = useSignUp()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) })

  // Email confirmation is off, so sign-up logs the user in directly and LoginPage redirects home.
  return (
    <form onSubmit={handleSubmit((values) => signUp.mutate(values))} className="space-y-4" noValidate>
      <FormField label="Username" autoComplete="username" error={errors.username?.message} {...register('username')} />
      <FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <FormField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {signUp.error && (
        <p role="alert" className="text-sm text-red-600">
          {signUp.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={signUp.isPending}
        className="w-full rounded-md bg-emerald-700 py-2 font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
      >
        {signUp.isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
