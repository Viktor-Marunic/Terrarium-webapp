// "What you'll need" block inside the guide card: the materials as a bulleted list on a soft sage background.
export function GuideMaterials({ materials }) {
  return (
    <section className="mt-5 rounded-lg bg-sage-50 p-4">
      <h2 className="font-semibold text-stone-900">What you’ll need</h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-stone-700 marker:text-forest-700">
        {materials.map((item, index) => (
          <li key={index} className="wrap-anywhere">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
