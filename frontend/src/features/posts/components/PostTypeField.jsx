// "Showcase / Question" toggle used by the create and edit post forms. Spread register('type') into it.
import { postTypes } from '../schemas'

export function PostTypeField(registration) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-stone-700">Post type</legend>
      <div className="mt-1 flex gap-2">
        {postTypes.map((type) => (
          <label
            key={type}
            className="flex-1 cursor-pointer rounded-md border border-stone-300 px-3 py-2 text-center text-sm capitalize has-checked:border-emerald-600 has-checked:bg-emerald-50 has-checked:text-emerald-800 has-focus-visible:ring-2 has-focus-visible:ring-emerald-600/40"
          >
            <input type="radio" value={type} className="sr-only" {...registration} />
            {type}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
