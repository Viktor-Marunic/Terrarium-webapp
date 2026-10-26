// One notification in the list: type icon, sentence, age, and a dot while unread.
// Clicking it marks it read, closes the panel (onNavigate) and opens the post or listing it's about.
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { describeNotification } from '../describeNotification'
import { useMarkNotificationRead } from '../hooks'

export function NotificationItem({ notification, onNavigate }) {
  const markRead = useMarkNotificationRead()
  const { icon: Icon, text, to } = describeNotification(notification)
  const isUnread = !notification.read_at

  const handleClick = () => {
    if (isUnread) markRead.mutate(notification.id)
    onNavigate()
  }

  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
        className={`flex gap-3 rounded-lg p-3 transition-colors hover:bg-cream ${isUnread ? 'bg-sage-50' : ''}`}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-forest-800">
          <Icon size={18} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block text-sm wrap-anywhere ${isUnread ? 'font-medium text-stone-900' : 'text-stone-700'}`}>{text}</span>
          <time dateTime={notification.created_at} className="text-xs text-stone-500">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </time>
        </span>
        {isUnread && (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-forest-700">
            <span className="sr-only">Unread</span>
          </span>
        )}
      </Link>
    </li>
  )
}
