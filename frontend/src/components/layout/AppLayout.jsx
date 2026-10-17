// Shell around every logged-in page: header on top, page content in the middle, tab bar on phones.
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-svh bg-stone-100">
      <Header />
      {/* Extra bottom padding on phones so content isn't hidden behind the fixed BottomNav. */}
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-24 md:pb-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
