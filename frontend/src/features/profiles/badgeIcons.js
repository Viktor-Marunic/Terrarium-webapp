// The database stores a badge's icon as a short key (badges.icon); this maps it to the Phosphor icon to draw.
import { ArrowFatUpIcon, ChatCircleIcon, ChatsIcon, ImageIcon, MedalIcon, PlantIcon } from '@phosphor-icons/react'

const icons = { plant: PlantIcon, chat: ChatCircleIcon, image: ImageIcon, chats: ChatsIcon, upvote: ArrowFatUpIcon }

/** Icon component for a badge; a generic medal for keys this version of the app doesn't know yet. */
export function badgeIcon(key) {
  return icons[key] ?? MedalIcon
}
