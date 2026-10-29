// Header bell with an unread count; opens the notifications as a pop-up Sheet with a "Mark all read" action.
// Motion: the bell wiggles and the badge bumps when a new unread one arrives; rows rise in when the panel opens.
import { useEffect, useRef, useState } from 'react'
import { BellIcon } from '@phosphor-icons/react'
import { Sheet } from '../../../components/common/Sheet'
import { bump, wiggle } from '../../../lib/motion'
import { useStaggerIn } from '../../../lib/useStaggerIn'
import { useMarkAllNotificationsRead, useNotifications } from '../hooks'
import { NotificationItem } from './NotificationItem'

export function NotificationsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const notifications = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()
  const items = notifications.data ?? []
  const unreadCount = items.filter((notification) => !notification.read_at).length

  // Only when the count goes up after the first load (the 30-second poll found something new).
  const bellRef = useRef(null)
  const badgeRef = useRef(null)
  const previousUnread = useRef(null)
  useEffect(() => {
    if (previousUnread.current !== null && unreadCount > previousUnread.current) {
      wiggle(bellRef.current)
      bump(badgeRef.current)
    }
    previousUnread.current = unreadCount
  }, [unreadCount])

  const listRef = useStaggerIn([isOpen, notifications.data], { scrollLinked: false })

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        className="relative flex size-10 items-center justify-center rounded-full text-forest-800 transition-colors hover:bg-sage-50"
      >
        <BellIcon ref={bellRef} size={24} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            ref={badgeRef}
            aria-hidden="true"
            className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest-700 px-1 text-[10px] font-semibold text-white tabular-nums"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Notifications"
        description="Votes, comments and marketplace activity that involves you."
        headerAction={
          unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="rounded-lg px-2 py-2 text-sm font-medium text-forest-700 hover:bg-cream disabled:opacity-60"
            >
              Mark all read
            </button>
          )
        }
      >
        {notifications.isLoading && <p className="text-stone-500">Loading notifications…</p>}
        {notifications.error && <p className="text-red-600">Could not load notifications: {notifications.error.message}</p>}
        {notifications.data && items.length === 0 && (
          <p className="py-8 text-center text-stone-600">Nothing yet. Votes, replies and marketplace activity will show up here.</p>
        )}
        {items.length > 0 && (
          <ul ref={listRef} className="-mx-2 space-y-1">
            {items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onNavigate={() => setIsOpen(false)} />
            ))}
          </ul>
        )}
      </Sheet>
    </>
  )
}
