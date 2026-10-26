// Turns a notification row into what the list shows: an icon, a sentence and where clicking it goes.
// One entry per type in the notifications.type check constraint; add new types (e.g. messages) here too.
import { ChatCircleIcon, HeartIcon, ShoppingBagIcon, StorefrontIcon, ArrowFatUpIcon } from '@phosphor-icons/react'

/** @returns {{ icon: React.ComponentType, text: string, to: string }} */
export function describeNotification(notification) {
  const actor = `@${notification.actor?.username ?? 'someone'}`
  // The target can be missing for a moment between a delete and the cascade; fall back to a generic name.
  const post = `“${notification.post?.title ?? 'a post'}”`
  const listing = `“${notification.listing?.title ?? 'a listing'}”`
  const postLink = `/posts/${notification.post_id}`
  const listingLink = `/shop/${notification.listing_id}`

  switch (notification.type) {
    case 'post_vote':
      return { icon: ArrowFatUpIcon, text: `${actor} upvoted your post ${post}`, to: postLink }
    case 'comment_vote':
      return { icon: ArrowFatUpIcon, text: `${actor} upvoted your comment on ${post}`, to: postLink }
    case 'post_comment':
      return { icon: ChatCircleIcon, text: `${actor} commented on your post ${post}`, to: postLink }
    case 'comment_reply':
      return { icon: ChatCircleIcon, text: `${actor} replied to your comment on ${post}`, to: postLink }
    case 'new_listing':
      return { icon: StorefrontIcon, text: `${actor} listed ${listing} in the marketplace`, to: listingLink }
    case 'listing_bookmarked':
      return { icon: HeartIcon, text: `${actor} saved your listing ${listing}`, to: listingLink }
    case 'listing_in_cart':
      return { icon: ShoppingBagIcon, text: `${actor} added ${listing} to their bag`, to: listingLink }
    default:
      return { icon: ChatCircleIcon, text: 'New activity', to: '/' }
  }
}
