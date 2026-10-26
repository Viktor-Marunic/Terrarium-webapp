// Password AuthField with an eye button to show/hide what's typed (handy on phones). Pass register() props through.
import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { AuthField } from './AuthField'

export function PasswordField(props) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <AuthField
      // Faded dots hint that this is the password box; used by both the login and sign-up forms.
      placeholder="••••••••"
      {...props}
      type={isVisible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-md text-stone-500 hover:text-stone-800"
        >
          {isVisible ? <EyeIcon size={20} aria-hidden="true" /> : <EyeSlashIcon size={20} aria-hidden="true" />}
        </button>
      }
    />
  )
}
