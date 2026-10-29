// Profile header card (TerraSpace mockup): picture, name + @username, bio, location · join date,
// a row of stats and the earned badges as chips.
import { format } from 'date-fns'
import { avatarSrc } from '../avatar'
import { badgeIcon } from '../badgeIcons'
import { CountUp } from './CountUp'

/**
 * stats: [{ label, value }] from the page, because posts, listings and events belong to other features;
 * value is undefined while it loads (shown as "–").
 * badges: the user's earned badges (useUserBadges filtered to earned); undefined while they load.
 */
export function ProfileCard({ profile, stats, badges }) {
  const name = profile.display_name || `@${profile.username}`
  const meta = [profile.location, `Joined ${format(new Date(profile.created_at), 'MMMM yyyy')}`].filter(Boolean)

  return (
    <section className="rounded-2xl border border-stone-200 bg-paper p-5">
      <div className="flex items-center gap-4">
        <img src={avatarSrc(profile)} alt="" className="size-16 shrink-0 rounded-full bg-sage-100" />
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-forest-800">{name}</h2>
          {/* Only repeat the @username when a display name took its place above. */}
          {profile.display_name && <p className="truncate text-sm text-stone-500">@{profile.username}</p>}
        </div>
      </div>

      <p className="mt-4 leading-relaxed wrap-anywhere text-stone-700">
        {profile.bio || <span className="text-stone-400 italic">No bio yet</span>}
      </p>
      <p className="mt-3 text-xs text-stone-500">{meta.join(' · ')}</p>

      <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-stone-200 pt-4">
        {stats.map(({ label, value }) => (
          // dt after dd in the markup order is fine for screen readers; flex-col-reverse puts the number on top.
          <div key={label} className="flex flex-col-reverse">
            <dt className="text-xs text-stone-500">{label}</dt>
            <dd className="text-lg font-semibold text-forest-800 tabular-nums">
              <CountUp value={value} />
            </dd>
          </div>
        ))}
      </dl>

      {badges?.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {badges.map(({ id, title, icon }) => {
            const Icon = badgeIcon(icon)
            return (
              <li key={id} className="flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-xs font-medium text-forest-800">
                <Icon size={14} aria-hidden="true" />
                {title}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
