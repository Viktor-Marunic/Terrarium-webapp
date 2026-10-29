// One guide in the list: cover photo, level + category + reading time, title, the start of the text, author, save.
// The whole card opens the guide (the title link is stretched over the card).
import { Link } from 'react-router-dom'
import { ListingImage } from '../../../components/common/ListingImage'
import { Avatar } from '../../profiles/components/Avatar'
import { guideCategoryLabel, guideLevelLabel, readingTime } from '../schemas'
import { GuideSaveButton } from './GuideSaveButton'

export function GuideCard({ guide }) {
  return (
    // has-[a:focus-visible] rings the whole card when its stretched title link is focused with the keyboard.
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-paper transition-shadow hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-forest-700">
      <div className="relative aspect-[5/2]">
        <ListingImage src={guide.image_url} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
          {guideLevelLabel(guide.level)} · {guideCategoryLabel(guide.category)} · {readingTime(guide)}
        </p>
        <h2 className="text-lg leading-snug font-semibold wrap-anywhere text-stone-900">
          {/* after:absolute inset-0 makes this link cover the whole card. */}
          <Link to={`/guide/${guide.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {guide.title}
          </Link>
        </h2>
        <p className="line-clamp-2 text-sm wrap-anywhere text-stone-600">{guide.body}</p>
        {/* mt-auto keeps the author row at the bottom, so cards in the same grid row line up. */}
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs">
          <Avatar profile={guide.author} size={22} />
          <span className="min-w-0 flex-1 truncate text-stone-600">@{guide.author?.username ?? 'deleted'}</span>
          <GuideSaveButton guide={guide} />
        </div>
      </div>
    </article>
  )
}
