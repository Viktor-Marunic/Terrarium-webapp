// Root component: app-wide providers and the route table.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from '../features/auth/components/RequireAuth'
import { AppLayout } from '../components/layout/AppLayout'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { CommunitiesPage } from '../pages/CommunitiesPage'
import { PostPage } from '../pages/PostPage'
import { ShopPage } from '../pages/ShopPage'
import { SellPage } from '../pages/SellPage'
import { ListingPage } from '../pages/ListingPage'
import { EditListingPage } from '../pages/EditListingPage'
import { GuidePage } from '../pages/GuidePage'
import { EventsPage } from '../pages/EventsPage'
import { EventPage } from '../pages/EventPage'
import { CreateEventPage } from '../pages/CreateEventPage'
import { EditEventPage } from '../pages/EditEventPage'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Every page inside the layout needs a logged-in user for now. */}
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="communities" element={<CommunitiesPage />} />
            <Route path="posts/:id" element={<PostPage />} />
            <Route path="shop" element={<ShopPage />} />
            {/* React Router ranks the static "new" above ":id", so /shop/new never loads a listing called "new". */}
            <Route path="shop/new" element={<SellPage />} />
            <Route path="shop/:id" element={<ListingPage />} />
            <Route path="shop/:id/edit" element={<EditListingPage />} />
            <Route path="guide" element={<GuidePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/new" element={<CreateEventPage />} />
            <Route path="events/:id" element={<EventPage />} />
            <Route path="events/:id/edit" element={<EditEventPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
