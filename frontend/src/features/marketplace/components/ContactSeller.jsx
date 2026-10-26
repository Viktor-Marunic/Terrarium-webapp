// "Contact seller" button that reveals the contact info the seller wrote on their listing.
// Behind a click so the details aren't the first thing on the page; an email address becomes a mailto: link.
import { useState } from 'react'
import { ChatCircleIcon } from '@phosphor-icons/react'

// Loose check: only decides whether to offer a mailto: link, not whether the address is valid.
const looksLikeEmail = (text) => /^\S+@\S+\.\S+$/.test(text)

export function ContactSeller({ contactInfo, sellerUsername }) {
  const [isRevealed, setIsRevealed] = useState(false)

  if (!isRevealed) {
    return (
      <button
        type="button"
        onClick={() => setIsRevealed(true)}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 py-2.5 font-medium text-white hover:bg-emerald-800"
      >
        <ChatCircleIcon size={20} aria-hidden="true" />
        Contact seller
      </button>
    )
  }

  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
      <p className="text-sm text-stone-600">Reach @{sellerUsername} at:</p>
      <p className="mt-1 font-medium break-words text-stone-900">
        {looksLikeEmail(contactInfo) ? (
          // External mailto: link, so a plain <a> (not a router <Link>) is correct here.
          <a href={`mailto:${contactInfo}`} className="text-emerald-800 underline">
            {contactInfo}
          </a>
        ) : (
          contactInfo
        )}
      </p>
    </div>
  )
}
