// Small card showing a user's avatar and basic account info.
import { format } from 'date-fns'
import { avatarSrc } from '../avatar'

export function ProfileCard({ profile, email }) {
  return (
    <section className="flex w-full max-w-md items-center gap-4 rounded-xl bg-white p-5 shadow-md">
      <img
        src={avatarSrc(profile)}
        alt={`${profile.username}'s avatar`}
        className="size-20 shrink-0 rounded-full bg-stone-100"
      />
      <dl className="min-w-0 text-sm">
        <dt className="sr-only">Username</dt>
        <dd className="text-lg font-semibold text-emerald-800">@{profile.username}</dd>
        <dt className="sr-only">Email</dt>
        <dd className="truncate text-stone-600">{email}</dd>
        <dt className="sr-only">Joined</dt>
        <dd className="text-stone-500">Joined {format(new Date(profile.created_at), 'd MMM yyyy')}</dd>
        <dt className="sr-only">Bio</dt>
        <dd className="mt-1 text-stone-700">{profile.bio || <span className="text-stone-400 italic">No bio yet</span>}</dd>
      </dl>
    </section>
  )
}
