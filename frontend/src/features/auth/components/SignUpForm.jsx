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

  // No session after sign-up means Supabase wants the email confirmed first.
  if (signUp.isSuccess && !signUp.data.session) {
    return (
      <p role="status" className="text-stone-700">
        Account created! Check your email to confirm it, then log in.
      </p>
    )
  }

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
