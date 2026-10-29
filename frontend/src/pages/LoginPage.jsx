// /login — the TerraSpace sign-up / log-in card (mockup: "Create your profile"), switching between the two forms.
// Has its own logo-only top bar because it sits outside AppLayout (no tabs, bag or avatar before logging in).
import { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PlantIcon } from '@phosphor-icons/react'
import { DURATION, gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
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
  const cardRef = useRef(null)
  const hasEntered = useRef(false)

  // First visit: the card rises in, then its fields follow one by one. Switching between log in and sign up
  // replays just the fields, so the new form doesn't snap in. (Before the early return: hooks run every render.)
  useGSAP(
    () => {
      const card = cardRef.current
      if (!card) return
      const reduce = prefersReducedMotion()
      const timeline = gsap.timeline({ defaults: { ease: 'ui-out', clearProps: 'transform,opacity' } })
      if (!hasEntered.current) {
        // Marked when finished, not up front, so React StrictMode's dev double-run still plays it.
        timeline.from(card, {
          opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98, duration: 0.45,
          onComplete: () => (hasEntered.current = true),
        })
      }
      timeline.from(
        card.querySelector('form').children,
        { opacity: 0, y: reduce ? 0 : 10, duration: DURATION.ui, stagger: { amount: 0.25 } },
        '-=0.25',
      )
    },
    { dependencies: [mode] },
  )

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
        <div ref={cardRef} className="mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-paper p-5 sm:p-8">
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
