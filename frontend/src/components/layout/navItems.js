// Main navigation links, shared by the desktop header and the mobile bottom bar so they never drift apart.
import { BookOpenTextIcon, CalendarDotsIcon, StorefrontIcon, UserIcon, UsersThreeIcon } from '@phosphor-icons/react'

export const navItems = [ 
  { to: '/communities', label: 'Communities', icon: UsersThreeIcon },
  { to: '/shop', label: 'Shop', icon: StorefrontIcon },
  { to: '/guide', label: 'Guide', icon: BookOpenTextIcon },
  { to: '/events', label: 'Events', icon: CalendarDotsIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon },
]
