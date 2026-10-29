// Labeled input, textarea (as="textarea") or select (as="select", options as children) with its validation message.
// Spread react-hook-form's register() into it. The validation message fades in (and again when it changes).
import { FadeIn } from './FadeIn'

export function FormField({ label, error, as: Control = 'input', ...inputProps }) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <Control
        className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 focus:border-forest-700 focus:outline-none"
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error && (
        <FadeIn key={error} className="mt-1 block text-sm text-red-600">
          {error}
        </FadeIn>
      )}
    </label>
  )
}
