// The logged-in user's avatar, sized like a Phosphor icon so it can replace one in the navigation.
// `weight="fill"` is what nav links pass for the active tab, so it shows as a ring around the avatar.
import { UserIcon } from '@phosphor-icons/react'
import { useSession } from '../../auth/hooks'
import { useProfile } from '../hooks'
import { avatarSrc } from '../avatar'

export function MyAvatarIcon({ size = 24, weight }) {
  const { session } = useSession()
  const profile = useProfile(session?.user.id)

  // Plain icon until the profile has loaded (or if it fails), so the nav never shows a broken image.
  if (!profile.data) return <UserIcon size={size} weight={weight} aria-hidden="true" />

  return (
    <img
      src={avatarSrc(profile.data)}
      alt=""
      width={size}
      height={size}
      className={`rounded-full bg-stone-100 ${weight === 'fill' ? 'ring-2 ring-emerald-600' : ''}`}
    />
  )
}
