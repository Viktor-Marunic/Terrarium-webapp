// Labeled input with its validation message; spread react-hook-form's register() into it.
export function FormField({ label, error, ...inputProps }) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  )
}
