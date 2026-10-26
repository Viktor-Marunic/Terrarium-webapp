// Shell around every logged-in page: header with tabs on top, page content, footer at the bottom.
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function AppLayout() {
  return (
    // Column flex + flex-1 on main keeps the footer at the bottom of the screen even on short pages.
    // overflow-x-clip is a safety net: nothing a user types can make the page scroll sideways on a phone
    // (clip, unlike hidden, keeps the sticky header working).
    <div className="flex min-h-svh flex-col overflow-x-clip bg-cream">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
