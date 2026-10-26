// Pop-up panel shared by the shopping bag and notifications: a bottom sheet on phones (swipe down to close),
// a panel sliding in from the right from md up. Built on vaul, which handles focus trapping, Escape,
// the backdrop, drag gestures and the enter/exit motion (and respects reduced-motion settings).
import { useSyncExternalStore } from 'react'
import { Drawer } from 'vaul'
import { XIcon } from '@phosphor-icons/react'

const DESKTOP_QUERY = '(min-width: 768px)'
const subscribe = (onChange) => {
  const query = window.matchMedia(DESKTOP_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const getIsDesktop = () => window.matchMedia(DESKTOP_QUERY).matches

/**
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void, title: string, description: string,
 *           headerAction?: React.ReactNode, footer?: React.ReactNode, children: React.ReactNode }} props
 * `description` is for screen readers only; `footer` stays pinned below the scrolling content.
 */
export function Sheet({ open, onOpenChange, title, description, headerAction, footer, children }) {
  const isDesktop = useSyncExternalStore(subscribe, getIsDesktop)

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction={isDesktop ? 'right' : 'bottom'}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-stone-900/30" />
        <Drawer.Content
          className={`fixed z-50 flex flex-col bg-paper shadow-2xl outline-none ${
            isDesktop
              ? 'inset-y-0 right-0 w-full max-w-md'
              : 'inset-x-0 bottom-0 max-h-[88svh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]'
          }`}
        >
          {!isDesktop && <Drawer.Handle className="mt-3 !w-10 !bg-stone-300" />}
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
            <Drawer.Title className="font-display text-2xl text-forest-800">{title}</Drawer.Title>
            <div className="flex items-center gap-2">
              {headerAction}
              <Drawer.Close
                aria-label="Close"
                className="flex size-10 items-center justify-center rounded-lg bg-cream text-stone-700 transition-colors hover:bg-sage-100"
              >
                <XIcon size={20} aria-hidden="true" />
              </Drawer.Close>
            </div>
          </div>
          <Drawer.Description className="sr-only">{description}</Drawer.Description>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
          {footer && <div className="border-t border-stone-200 px-5 pt-4 pb-5">{footer}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
