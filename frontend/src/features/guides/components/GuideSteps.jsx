// "Steps" inside the guide card: one block per step with its number in a dark green circle.
export function GuideSteps({ steps }) {
  return (
    <section className="mt-5">
      <h2 className="font-semibold text-stone-900">Steps</h2>
      <ol className="mt-2 space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center gap-3 rounded-lg border border-stone-100 bg-stone-50 p-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-forest-700 text-lg font-semibold text-white"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold wrap-anywhere text-stone-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed wrap-anywhere whitespace-pre-line text-stone-600">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
