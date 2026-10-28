// Guide page body: cover photo (if any), category + reading time, title, author + date, like/save, then the text.
// The author also gets Edit / Delete; RLS is what actually stops anyone else.
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ListingImage } from '../../../components/common/ListingImage'
import { EditDeleteButtons } from '../../../components/common/EditDeleteButtons'
import { Avatar } from '../../profiles/components/Avatar'
import { useDeleteGuide } from '../hooks'
import { guideCategoryLabel, readingTime } from '../schemas'
import { GuideReactions } from './GuideReactions'

export function GuideDetails({ guide, currentUserId }) {
  const navigate = useNavigate()
  const deleteGuide = useDeleteGuide()
  const isAuthor = guide.author_id === currentUserId

  const handleDelete = () =>
    deleteGuide.mutate({ id: guide.id, imageUrl: guide.image_url }, { onSuccess: () => navigate('/guide', { replace: true }) })

  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-paper">
      {guide.image_url && (
        <div className="relative aspect-[2/1]">
          <ListingImage src={guide.image_url} alt={guide.title} />
        </div>
      )}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
            {guideCategoryLabel(guide.category)} · {readingTime(guide.body)}
          </p>
          {isAuthor && (
            <EditDeleteButtons
              iconsOnMobile
              onEdit={() => navigate(`/guide/${guide.id}/edit`)}
              onDelete={handleDelete}
              isDeleting={deleteGuide.isPending}
              confirmMessage="Delete this guide? This cannot be undone."
            />
          )}
        </div>
        <h1 className="font-display text-[28px] leading-tight wrap-anywhere text-forest-800">{guide.title}</h1>
        <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 pb-4">
          <Avatar profile={guide.author} size={32} />
          <p className="min-w-0 flex-1 text-sm text-stone-600">
            <span className="font-medium text-stone-900">@{guide.author?.username ?? 'deleted'}</span>
            {' · '}
            <time dateTime={guide.created_at}>{format(new Date(guide.created_at), 'd MMM yyyy')}</time>
          </p>
          <GuideReactions guide={guide} />
        </div>
        <p className="leading-relaxed wrap-anywhere whitespace-pre-line text-stone-700">{guide.body}</p>
        {deleteGuide.error && <p className="text-sm text-red-600">{deleteGuide.error.message}</p>}
      </div>
    </article>
  )
}
