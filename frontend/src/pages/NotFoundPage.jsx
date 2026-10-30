// /404 — "Nothing growing here." Shown for things that don't exist yet (checkout, guest access).
// Sits outside the logged-in layout (like the login page), so it works whether or not you're logged in;
// "Go Home" opens "/", which leads to the community feed, or to the login page when logged out.
import { Link } from 'react-router-dom'
import { HouseIcon, PlantIcon } from '@phosphor-icons/react'
import { RootsDecoration } from '../components/layout/RootsDecoration'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <header className="border-b border-stone-200 bg-paper pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4 text-forest-800">
          <PlantIcon size={28} aria-hidden="true" />
          <span className="font-display text-2xl">TerraSpace</span>
        </div>
      </header>
      {/* Centred in the space under the header; more padding below than above sits it slightly above true centre,
          which reads as centred to the eye. Short phones (e.g. iPhone SE) get smaller roots and padding so it all
          fits on one screen; tall ones (min-height 760px) get the full size. */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-6 pb-10 text-center [@media(min-height:760px)]:pt-10 [@media(min-height:760px)]:pb-24">
        <RootsDecoration className="w-48 [@media(max-height:600px)]:w-36 [@media(min-height:760px)]:w-64 sm:[@media(min-height:760px)]:w-72" />
        <p className="mt-4 font-display text-6xl text-forest-800 [@media(min-height:760px)]:mt-6 [@media(min-height:760px)]:text-7xl">404</p>
        <h1 className="mt-4 font-display text-[28px] leading-tight text-forest-800">Nothing growing here.</h1>
        <p className="mt-4 max-w-xs leading-relaxed text-stone-600">This page doesn't exist in our little ecosystem.</p>
        <Link
          to="/"
          className="mt-10 flex items-center gap-2 rounded-lg bg-forest-700 px-7 py-3.5 font-medium text-white transition-colors hover:bg-forest-800"
        >
          <HouseIcon size={18} aria-hidden="true" />
          Go Home
        </Link>
      </main>
    </div>
  )
}
