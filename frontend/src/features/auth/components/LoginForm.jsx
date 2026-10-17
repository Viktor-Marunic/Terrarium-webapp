// Email + password login. On success the session changes and LoginPage redirects home.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas'
import { useSignIn } from '../hooks'
import { FormField } from '../../../components/common/FormField'

export function LoginForm() {
  const signIn = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  return (
    <form onSubmit={handleSubmit((values) => signIn.mutate(values))} className="space-y-4" noValidate>
      <FormField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <FormField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {signIn.error && (
        <p role="alert" className="text-sm text-red-600">
          {signIn.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={signIn.isPending}
        className="w-full rounded-md bg-emerald-700 py-2 font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
      >
        {signIn.isPending ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}
