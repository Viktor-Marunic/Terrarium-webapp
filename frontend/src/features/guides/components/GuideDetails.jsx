// Guide page body, styled like a community post (white card, small meta line, action pills at the bottom),
// with the guide's own parts inside: intro, photo, "What you'll need" and numbered steps.
// The author also gets Edit / Delete; RLS is what actually stops anyone else.
import { Link, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ChatCircleIcon } from '@phosphor-icons/react'
import { EditDeleteButtons } from '../../../components/common/EditDeleteButtons'
import { Avatar } from '../../profiles/components/Avatar'
import { useDeleteGuide } from '../hooks'
import { guideCategoryLabel, guideLevelLabel, readingTime } from '../schemas'
import { GuideSaveButton } from './GuideSaveButton'
import { GuideMaterials } from './GuideMaterials'
import { GuideSteps } from './GuideSteps'

export function GuideDetails({ guide, currentUserId }) {
  const navigate = useNavigate()
  const deleteGuide = useDeleteGuide()
  const isAuthor = guide.author_id === currentUserId

  const handleDelete = () =>
    deleteGuide.mutate({ id: guide.id, imageUrl: guide.image_url }, { onSuccess: () => navigate('/guide', { replace: true }) })

  return (
    <article className="rounded-lg bg-white p-4 shadow-sm">
      {/* On phones the info wraps onto two lines, so the icons sit on the first line instead of between them. */}
      <div className="flex items-start justify-between gap-3 sm:items-center">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
          <span className="rounded-full bg-sage-100 px-2 py-0.5 font-semibold text-forest-800">
            {guideLevelLabel(guide.level)} · {guideCategoryLabel(guide.category)}
          </span>
          <span className="flex items-center gap-1.5">
            <Avatar profile={guide.author} size={26} />@{guide.author?.username ?? 'deleted'}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={guide.created_at}>{formatDistanceToNow(new Date(guide.created_at), { addSuffix: true })}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime(guide)}</span>
        </div>
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
      <h1 className="mt-2 text-xl font-semibold wrap-anywhere text-stone-900">{guide.title}</h1>
      <p className="mt-3 wrap-anywhere whitespace-pre-line text-stone-800">{guide.body}</p>
      {guide.image_url && (
        <img src={guide.image_url} alt={guide.title} className="mt-4 w-full rounded-lg bg-sage-100 object-cover" />
      )}
      {/* Guides written before materials and steps existed simply skip these sections. */}
      {guide.materials.length > 0 && <GuideMaterials materials={guide.materials} />}
      {guide.steps.length > 0 && <GuideSteps steps={guide.steps} />}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-stone-100 pt-3">
        <GuideSaveButton guide={guide} />
        <Link
          to="/communities"
          className="ml-auto flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:text-forest-800"
        >
          <ChatCircleIcon size={16} aria-hidden="true" />
          Ask a question in Community
        </Link>
      </div>
      {deleteGuide.error && <p className="mt-2 text-sm text-red-600">{deleteGuide.error.message}</p>}
    </article>
  )
}
