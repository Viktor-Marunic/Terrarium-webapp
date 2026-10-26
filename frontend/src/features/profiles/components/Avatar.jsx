// Small round profile picture shown next to a username (post author, comment author).
import { avatarSrc } from '../avatar'

export function Avatar({ profile, size = 26 }) {
  // Deleted accounts have no profile, so there's nothing to show.
  if (!profile) return null

  return <img src={avatarSrc(profile)} alt="" width={size} height={size} className="shrink-0 rounded-full bg-stone-100" />
}
