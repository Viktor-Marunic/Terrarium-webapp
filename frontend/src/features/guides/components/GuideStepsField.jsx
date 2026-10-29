// The "Steps" part of the guide form: a numbered title + description per step, with "Add step" and remove.
// Uses react-hook-form's useFieldArray, so pass the form's control, register and errors in.
import { useFieldArray } from 'react-hook-form'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { FormField } from '../../../components/common/FormField'
import { emptyStep } from '../schemas'

export function GuideStepsField({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'steps' })

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-stone-700">Steps</legend>
      {/* useFieldArray's own id as key, so removing a step doesn't shift the typed text into the wrong card. */}
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-center justify-between">
            <span className="flex size-6 items-center justify-center rounded-full bg-forest-700 text-xs font-semibold text-white">
              {index + 1}
            </span>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove step ${index + 1}`}
                className="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-red-600"
              >
                <TrashIcon size={14} aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
          <FormField
            label="Step title"
            placeholder="e.g. Add drainage"
            error={errors.steps?.[index]?.title?.message}
            {...register(`steps.${index}.title`)}
          />
          <FormField
            label="What to do"
            as="textarea"
            rows={2}
            placeholder="e.g. Spread 2–3 cm of lava rock across the bottom…"
            error={errors.steps?.[index]?.text?.message}
            {...register(`steps.${index}.text`)}
          />
        </div>
      ))}
      {errors.steps?.message && <p className="text-sm text-red-600">{errors.steps.message}</p>}
      <button
        type="button"
        onClick={() => append(emptyStep)}
        className="flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:underline"
      >
        <PlusIcon size={14} weight="bold" aria-hidden="true" />
        Add step
      </button>
    </fieldset>
  )
}
