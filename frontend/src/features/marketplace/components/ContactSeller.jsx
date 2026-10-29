// "Contact seller" button that reveals the contact info the seller wrote on their listing.
// Behind a click so the details aren't the first thing on the page; an email address becomes a mailto: link.
// The revealed box fades in where the button was.
import { useState } from 'react'
import { ChatCircleIcon } from '@phosphor-icons/react'
import { FadeIn } from '../../../components/common/FadeIn'

// Loose check: only decides whether to offer a mailto: link, not whether the address is valid.
const looksLikeEmail = (text) => /^\S+@\S+\.\S+$/.test(text)

export function ContactSeller({ contactInfo, sellerUsername }) {
  const [isRevealed, setIsRevealed] = useState(false)

  if (!isRevealed) {
    return (
      <button
        type="button"
        onClick={() => setIsRevealed(true)}
        // Secondary style: "Add to bag" above it is the main action.
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-paper py-2.5 text-sm font-medium text-forest-800 transition-[border-color,scale] hover:border-forest-700 motion-safe:active:scale-[0.98]"
      >
        <ChatCircleIcon size={18} aria-hidden="true" />
        Contact seller
      </button>
    )
  }

  return (
    <FadeIn as="div" className="rounded-lg border border-sage-200 bg-sage-50 p-4">
      <p className="text-sm text-stone-600">Reach @{sellerUsername} at:</p>
      <p className="mt-1 font-medium wrap-anywhere text-stone-900">
        {looksLikeEmail(contactInfo) ? (
          // External mailto: link, so a plain <a> (not a router <Link>) is correct here.
          <a href={`mailto:${contactInfo}`} className="text-forest-700 underline hover:text-forest-800">
            {contactInfo}
          </a>
        ) : (
          contactInfo
        )}
      </p>
    </FadeIn>
  )
}
