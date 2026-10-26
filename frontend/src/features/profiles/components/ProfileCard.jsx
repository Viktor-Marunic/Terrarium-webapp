// Profile header card (TerraSpace Figma): avatar, username, bio, join date and the user's stats.
import { format } from 'date-fns'
import { avatarSrc } from '../avatar'
import { badgeIcon } from '../badgeIcons'

/**
 * postCount comes from the page because posts belong to the posts feature; undefined while it loads.
 * badges are the user's earned badges (useUserBadges filtered to earned), shown as chips; undefined while they load.
 */
export function ProfileCard({ profile, postCount, badges }) {
  return (
    <section className="rounded-xl bg-paper p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={avatarSrc(profile)}
          alt={`${profile.username}'s avatar`}
          className="size-16 shrink-0 rounded-full bg-sage-100"
        />
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-forest-800">{profile.username}</h2>
          <p className="truncate text-sm text-stone-500">@{profile.username}</p>
        </div>
      </div>

      <p className="mt-4 text-sm break-words text-stone-700">
        {profile.bio || <span className="text-stone-400 italic">No bio yet</span>}
      </p>
      <p className="mt-3 text-xs text-stone-500">Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</p>

      <dl className="mt-4 flex gap-8 border-t border-stone-200 pt-4">
        <div>
          <dd className="text-lg font-semibold text-forest-800">{postCount ?? '–'}</dd>
          <dt className="text-xs text-stone-500">Posts</dt>
        </div>
        <div>
          <dd className="text-lg font-semibold text-forest-800">{badges?.length ?? '–'}</dd>
          <dt className="text-xs text-stone-500">Badges</dt>
        </div>
      </dl>

      {badges?.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {badges.map(({ id, title, icon }) => {
            const Icon = badgeIcon(icon)
            return (
              <li key={id} className="flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-forest-800">
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
