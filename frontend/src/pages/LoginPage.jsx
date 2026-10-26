// /login — the TerraSpace sign-up / log-in card (mockup: "Create your profile"), switching between the two forms.
// Has its own logo-only top bar because it sits outside AppLayout (no tabs, bag or avatar before logging in).
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PlantIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { LoginForm } from '../features/auth/components/LoginForm'
import { SignUpForm } from '../features/auth/components/SignUpForm'

const copy = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to your TerraSpace account.',
    switchPrompt: 'New here?',
    switchAction: 'Create a profile',
  },
  signup: {
    title: 'Create your profile',
    subtitle: 'Join the TerraSpace community. It only takes a minute.',
    switchPrompt: 'Already a member?',
    switchAction: 'Log in',
  },
}

export function LoginPage() {
  const { session } = useSession()
  const [mode, setMode] = useState('login')

  if (session) return <Navigate to="/" replace />

  const text = copy[mode]
  return (
    <div className="min-h-svh bg-cream">
      <header className="border-b border-stone-200 bg-paper pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4 text-forest-800">
          <PlantIcon size={28} aria-hidden="true" />
          <span className="font-display text-2xl">TerraSpace</span>
        </div>
      </header>
      <main className="px-4 pt-6 pb-12 sm:pt-16">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-paper p-5 sm:p-8">
          <h1 className="font-display text-[28px] leading-tight text-forest-800">{text.title}</h1>
          <p className="mt-1 mb-6 text-sm text-stone-500">{text.subtitle}</p>
          {/* key: switching modes mounts a fresh form, so values and errors don't carry over. */}
          {mode === 'login' ? <LoginForm key="login" /> : <SignUpForm key="signup" />}
          <p className="mt-5 text-center text-sm text-stone-500">
            {text.switchPrompt}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-medium text-forest-700 underline-offset-2 hover:underline"
            >
              {text.switchAction}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
