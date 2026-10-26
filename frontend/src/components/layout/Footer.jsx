// Site footer from the TerraSpace mockup: tagline, small links and copyright.
// The guidelines and help pages don't exist yet, so those two are plain text instead of dead links.
export function Footer() {
  return (
    // Bottom padding keeps the text above the iPhone home indicator when running full-screen.
    <footer className="border-t border-stone-200 bg-paper pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8">
        <p className="font-display text-lg text-forest-800">Small worlds. Shared wonder.</p>
        <ul className="space-y-2 text-sm text-stone-500">
          <li>Community guidelines</li>
          <li>Help &amp; support</li>
        </ul>
        <p className="text-sm text-stone-500">© {new Date().getFullYear()} TerraSpace</p>
      </div>
    </footer>
  )
}
