// "Achievements" section of the profile (TerraSpace Figma): one card per badge with a progress bar.
// `badges` come from useUserBadges (the database awards them and computes progress).
import { CheckCircleIcon } from '@phosphor-icons/react'
import { badgeIcon } from '../badgeIcons'

export function AchievementList({ badges }) {
  const earnedCount = badges.filter((b) => b.earned_at).length

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-forest-800">Achievements</h2>
        <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-forest-800">
          {earnedCount} of {badges.length}
        </span>
      </div>

      <ul className="space-y-3">
        {badges.map(({ id, title, description, icon, progress, goal, earned_at }) => {
          const Icon = badgeIcon(icon)
          return (
            <li key={id} className="rounded-xl bg-paper p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-forest-800">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
                  <p className="text-xs text-stone-600">{description}</p>
                </div>
                {earned_at && <CheckCircleIcon size={20} className="shrink-0 text-forest-700" aria-label="Earned" />}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <progress
                  value={progress}
                  max={goal}
                  aria-label={`${title} progress`}
                  className="h-1.5 flex-1 appearance-none overflow-hidden rounded-full bg-sage-100 [&::-moz-progress-bar]:bg-forest-700 [&::-webkit-progress-bar]:bg-sage-100 [&::-webkit-progress-value]:bg-forest-700"
                />
                <span className="text-xs font-medium text-stone-600">
                  {progress}/{goal}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
