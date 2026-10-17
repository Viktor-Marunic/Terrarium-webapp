// Main navigation links, shared by the desktop header and the mobile bottom bar so they never drift apart.
import { BookOpenTextIcon, CalendarDotsIcon, StorefrontIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { MyAvatarIcon } from '../../features/profiles/components/MyAvatarIcon'

export const navItems = [ 
  { to: '/communities', label: 'Communities', icon: UsersThreeIcon },
  { to: '/shop', label: 'Shop', icon: StorefrontIcon },
  { to: '/guide', label: 'Guide', icon: BookOpenTextIcon },
  { to: '/events', label: 'Events', icon: CalendarDotsIcon },
  // Profile shows the user's own avatar instead of a generic icon.
  { to: '/profile', label: 'Profile', icon: MyAvatarIcon },
]
