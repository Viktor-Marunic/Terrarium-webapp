// /login — one card that switches between "Log in" and "Sign up".
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '../features/auth/hooks'
import { LoginForm } from '../features/auth/components/LoginForm'
import { SignUpForm } from '../features/auth/components/SignUpForm'

export function LoginPage() {
  const { session } = useSession()
  const [mode, setMode] = useState('login')

  if (session) return <Navigate to="/" replace />

  const isLogin = mode === 'login'
  return (
    <main className="flex min-h-svh items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-1 text-center text-2xl font-semibold text-emerald-800">Terrarium</h1>
        <p className="mb-6 text-center text-sm text-stone-500">
          {isLogin ? 'Log in to your account' : 'Create a new account'}
        </p>
        {isLogin ? <LoginForm /> : <SignUpForm />}
        <p className="mt-6 text-center text-sm text-stone-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(isLogin ? 'signup' : 'login')}
            className="font-medium text-emerald-700 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </main>
  )
}
