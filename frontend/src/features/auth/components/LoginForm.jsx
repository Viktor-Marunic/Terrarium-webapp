// Email + password login. On success the session changes and LoginPage redirects home.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas'
import { useSignIn } from '../hooks'
import { AuthField } from './AuthField'
import { PasswordField } from './PasswordField'
import { AuthButtons } from './AuthButtons'

export function LoginForm() {
  const signIn = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  return (
    <form onSubmit={handleSubmit((values) => signIn.mutate(values))} className="space-y-5" noValidate>
      <AuthField
        label="Email address"
        required
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label="Password"
        required
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {signIn.error && (
        <p role="alert" className="text-sm text-red-600">
          {signIn.error.message}
        </p>
      )}
      <AuthButtons label="Log in" pendingLabel="Logging in…" isPending={signIn.isPending} />
    </form>
  )
}
