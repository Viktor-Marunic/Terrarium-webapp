// Labeled input for the login/sign-up card (TerraSpace mockup): label with a required star, optional leading
// and trailing slots inside the box (initials preview, show-password eye), a hint, and the validation message.
// Spread react-hook-form's register() into it. Auth-only: other forms keep using components/common/FormField.
import { useId } from 'react'
import { FadeIn } from '../../../components/common/FadeIn'

export function AuthField({ label, required = false, hint, error, leading, trailing, ...inputProps }) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {/* The border lives on the wrapper so the slots sit inside the box; focus-within draws the focus ring. */}
      <div
        className={`mt-1.5 flex items-center gap-2.5 rounded-lg border bg-white px-3 transition-[border-color,box-shadow] focus-within:border-forest-700 focus-within:ring-2 focus-within:ring-forest-700/15 ${
          error ? 'border-red-400' : 'border-stone-300'
        }`}
      >
        {leading}
        <input
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={[hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined}
          // text-base (16px) stops iOS Safari from zooming in when the field is focused.
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
          {...inputProps}
        />
        {trailing}
      </div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-stone-500">
          {hint}
        </p>
      )}
      {error && (
        // Fades in, and again when the message changes (key).
        <FadeIn as="p" key={error} id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </FadeIn>
      )}
    </div>
  )
}
