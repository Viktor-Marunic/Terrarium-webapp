// Avatar image URL for a profile, shared by the profile card and the nav icon.

/** Uploaded avatar if the user has one, otherwise a blobatar generated from their username (same name = same blob). */
export function avatarSrc(profile) {
  return profile.avatar_url || `https://blobatar.dev/avatar/${encodeURIComponent(profile.username)}`
}
