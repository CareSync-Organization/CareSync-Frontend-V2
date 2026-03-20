We are building CareSync frontend v2.

Repo:
`/home/batbook/Work/Career/Projects - Github Repositories/Tanstack Practice/caresync-frontend-v2`

Stack:
- React + TypeScript
- TanStack Router v1
- TanStack Form
- TanStack Table
- TanStack Query — installed, query client ready, but NOT yet wired to any real API calls
- Zustand for shared UI state (sidebar collapse); auth store not yet built
- Zod for validation
- shadcn/ui components
- Tailwind CSS v4
- Framer Motion
- next-themes
- Hugeicons (@hugeicons/core-free-icons + @hugeicons/react) for app icons
- lucide-react for utility icons
- Sonner for toast notifications — installed and Toaster added to main.tsx
- Sentry — installed and initialized in main.tsx (DSN via env); not yet actively used

Important working rule:
- Do not edit code unless explicitly allowed.
- Usually guidance and code snippets first.
- When allowed to edit, report every changed file clearly.

Project goal:
CareSync is an ecommerce customer-support SaaS. It connects channels like WhatsApp, Shopify, Daraz, Facebook, Instagram, and Email. It has auth pages, dashboard, conversations inbox, connectors, analytics, inventory, knowledge base, users/permissions, help/support, and store-level workflows.

---

## App structure

- `src/routes/_app/route.tsx` is the authenticated app shell (sidebar + navbar + animated outlet).
- Sidebar is hidden below `md`; mobile uses the drawer in `src/components/shared/navigation/mobile-drawer/drawer.tsx`.
- Main content scrolls independently with `overflow-y-auto`.
- Root `/` redirects to `/login`.
- `src/routes/__root.tsx` has `notFoundComponent`, `errorComponent`, and renders `<HeadContent />` for page titles.
- All routes have `head()` with `"Page Name | CareSync"` titles.
- Route transitions animate via `motion.main` with `key={topSegment}` in `_app/route.tsx`.
- Profile sub-tab transitions animate via `motion.div` with `key={pathname}` in profile `route.tsx`.
- Route loading screen (`src/components/shared/route-loading/RouteLoadingScreen.tsx`) uses a gradient background with the spinning CareSync logo. Wired as `pendingComponent` via `appRouteLoadingOptions`.

---

## Shared foundations

- Avatar: `src/components/shared/avatar/UserAvatar.tsx` — use this, never re-implement initials/fallback.
- Search: `src/components/shared/SearchInput.tsx` — use for all feature search bars.
- Form fields:
  - `src/components/shared/forms/InputField.tsx`
  - `src/components/shared/forms/CheckboxField.tsx`
  - `src/components/shared/forms/TextareaField.tsx`
  - `src/components/shared/ActionButton.tsx`
- Tables: `src/components/shared/data-table/` — `DataTable`, `DataTableColumnHeader`, `DataTablePagination`. Supports local and server-controlled sorting/filtering/pagination.
- Error display: `src/lib/get-field-error.ts` for TanStack Form errors.
- **IMPORTANT**: `asChild` does NOT work on `ActionButton` — it renders conditional wrapper children internally and `React.Children.only` will throw. Use `<Link>` wrapping `<ActionButton>`, or shadcn `<Button asChild>` directly.

---

## Auth

- Login, signup, and forgot password pages are complete.
- Forgot password form shows a success state in-place after submit (no navigation).
- Auth forms use TanStack Form + Zod.
- Files: `src/features/auth/components/` (forms, pages, left-panel), `src/features/auth/schemas/`.
- Auth route guards (`beforeLoad` redirects on `_app`) are intentionally deferred until backend auth strategy is confirmed.

---

## Error & not-found pages

- `src/components/shared/not-found/NotFoundPage.tsx` — 404 with branding, "Back to Dashboard".
- `src/components/shared/error-page/ErrorPage.tsx` — error boundary page, "Try Again" + "Back to Dashboard". Shows raw error message in dev only.

---

## Brand / theme

- Logo system: `src/components/shared/brand/animated-caresync-logo-icon.tsx`.
- Exports: `CareSyncLogoIcon`, `CareSyncLogoBadge`, `CareSyncLogoLockup`, `CareSyncLogoScene`, `CareSyncLogo`.
- `tone` prop on badge: `"brand"` = white bg (for light pages), `"light"` = semi-transparent (for dark/primary bg), `"dark"` = semi-transparent teal.
- Pass `className` with gradient classes to override badge bg: `className="bg-linear-to-b from-[#0F766E] to-[#14B8A6]"` — this always looks good on any background.
- `motion="spinning"` on the logo mark makes the two orbital dots spin continuously like a spinner. Used in RouteLoadingScreen.
- `CareSyncLogoLockup` has hardcoded `text-white` for the name — avoid it on light backgrounds.
- Theme toggle: `src/components/shared/ThemeModeToggle.tsx`. next-themes is working.

---

## Navigation

- Sidebar: `src/components/shared/navigation/sidebar/` — `Sidebar`, `SidebarTile`, `SidebarTopLogo`, `SidebarCollapseBtn`.
- Sidebar collapse state: Zustand store.
- `SidebarTile` has `activePropsStyles` prop to override active route highlight. Use `??` not `&&` when applying it.
- `nav-items.tsx` centralizes all nav items.
- Profile nav item links to `/profile/businessinfo` directly (not `/profile`).
- Navbar: `src/components/shared/navigation/navbar/` — `Navbar`, `ProfileSnapshot`, `NotificationsPopover`, `StoreSwitcher`.
- Mobile drawer: `src/components/shared/navigation/mobile-drawer/drawer.tsx`.

---

## Dashboard

- `src/features/dashboard/components/DashboardPage.tsx`.
- Mocks in `src/features/dashboard/mocks/`.
- Components: `MetricCard`, `RecentActivityCard`, `ChannelBreakdownCard`, `RecentConvoTable`, `NotificationCard`.
- Recent conversations table uses TanStack Table + shared `DataTable`. Has working search + filter dropdowns.

---

## Conversation

- `src/features/conversation/components/` — `ConversationPage`, `ConversationList`, `ConversationListItem`, `ConversationActions`, `ChatPanel`, `MessageBubble`, `MessageComposer`.
- Types: `src/features/conversation/types/`.
- `ConversationPage` owns selected conversation state. Mobile: list-first, then chat. Desktop: split.
- Chat scrolls internally. Data is local demo state, backend-ready.
- `ConversationList` has empty state (no results found UI).

---

## Connectors

- `src/features/connectors/components/` — `ConnectorsPage`, `ConnectorCard`, `AddStoreDialog`, `RequestIntegrationDialog`, `ConnectorActionDialog`, `DisconnectConnectorDialog`.
- Channels: WhatsApp, Shopify, Daraz, Facebook, Instagram, Email.
- All forms use TanStack Form + Zod. Flows are demo-only; backend will be OAuth, API key, or hybrid per connector.

---

## Knowledge Base

- `src/features/knowledge-base/components/` — `KnowledgeBasePage`, `KnowledgeDocumentDialog`.
- Mocks, schemas, types, utils in respective subdirectories.
- Has empty state. Local CRUD for now, FormData-ready for backend upload.

---

## Inventory

- `src/features/inventory/components/` — `InventoryPage`, `InventorySummaryCards`, `InventoryTable`, `InventoryItemDialog`.
- Uses shared `DataTable`. Has empty state via DataTable.
- Manual rows: editable/deletable. Synced rows (Shopify/Daraz): read-only.

---

## Users & Permissions

- `src/features/users/components/` — `UsersPage`, `UsersSummaryCards`, `UsersTable`, `InviteUserDialog`, `PermissionRow`.
- Config, mocks, schemas, types in subdirectories.
- Table has search + role/status filtering. Has empty state via DataTable.

---

## Profile & Settings

- Layout: `src/routes/_app/_settings/profile/route.tsx` — ProfileSidebar + animated Outlet.
- Sub-pages: businessinfo, userinfo, aiconfig, privacy, billing.
- Files: `src/features/profile/components/` subdirectories per section.
- Nav links to `/profile/businessinfo` directly so first tab is always active on entry.

---

## Help & Support

- `src/features/support/components/SupportPage.tsx`. Uses shared `SearchInput`.

---

## Shared channel config

- `src/features/integrations/config/channel-config.tsx` — channel labels, icons, badge/text/bar classes.
- Used by dashboard, conversations, connectors.

---

## Empty states

- `DataTable` has a visual empty state (SearchX icon + message) — covers Inventory and Users automatically.
- `ConversationList` has its own empty state.
- `KnowledgeBasePage` has its own empty state.

---

## Toast notifications (Sonner)

- Sonner installed. `<Toaster position="top-center" richColors />` in `main.tsx`.
- **Not yet wired to any forms** — toasts belong alongside TanStack Query mutations, not in placeholder `onSubmit` handlers.
- Add toasts in `onSuccess`/`onError` of mutations when backend is integrated.
- Places that need toasts once backend is wired: connector actions, inventory CRUD, knowledge base CRUD, user invite/remove, all profile save forms, profile picture upload.

---

## Remaining frontend work (pre-backend)

- Mobile navbar: currently shows only hamburger on mobile — needs logo center + avatar right.
- Mobile responsiveness audit across all pages.
- Skeleton loaders — add when TanStack Query `isLoading` states exist.

---

## Backend integration — things to keep in mind

### Auth
- Wait for backend partner to confirm strategy before building auth guards (JWT/Redis, Supabase, session-based all require different approaches).
- Once confirmed: add Zustand auth store with `{ accessToken, user, setAuth, clearAuth }`.
- Access token lives in memory only (NOT localStorage — XSS risk). Refresh token goes in httpOnly cookie (server sets it).
- Add `beforeLoad` guard on `src/routes/_app/route.tsx` that reads `useAuthStore.getState().token` and throws `redirect({ to: '/login' })` if null.
- On app load: call a `/auth/refresh` endpoint to bootstrap the access token from the refresh cookie. If it fails → redirect to login.
- After login: call `Sentry.setUser({ id, email })` so errors are tied to the right user.
- On logout: call `clearAuth()`, invalidate TanStack Query cache entirely, navigate to `/login`.

### TanStack Query
- Query client already initialized at `src/lib/query-client.ts`.
- Use `useQuery` for all reads, `useMutation` for all writes.
- Group dashboard into separate queries (don't one massive endpoint): metrics, recent activity, channel breakdown, conversations table.
- Wire toasts in mutation `onSuccess`/`onError` callbacks — not in form `onSubmit`.
- WebSocket events for live conversations: either patch TanStack Query cache directly or call `queryClient.invalidateQueries(...)`.
- Never let raw backend DTO shapes leak into UI components — map them to UI types at the query/mutation boundary.

### Sentry
- Already initialized in `main.tsx`.
- Wire `Sentry.captureException(error)` inside `ErrorPage.tsx` (the error boundary) so crashes are reported automatically.
- Set user identity after successful login: `Sentry.setUser({ id: user.id, email: user.email })`.
- Clear user on logout: `Sentry.setUser(null)`.
- For critical mutations (connector connect/disconnect, billing actions), wrap in try/catch and call `Sentry.captureException` manually.

### Store switcher
- Currently shows hardcoded stores. Needs real store list from backend (`/stores` or similar).
- Store context (which store is active) probably needs to live in the auth store or a separate Zustand store, and be sent as a header or param on API calls.

### Connectors
- Each connector will be a different flow: WhatsApp (likely API key), Shopify (OAuth), Daraz (API key), Facebook/Instagram (OAuth), Email (SMTP config).
- `ConnectorActionDialog` form fields will differ per connector type — the dialog may need to be made dynamic based on connector.

### Conversations / WebSocket
- `ChatPanel` and `MessageComposer` will need WebSocket integration for real-time.
- Message send: optimistic update in TanStack Query cache, then confirm/rollback on WS ack.
- Conversation list should auto-update when new messages arrive via WS.

### Data tables
- All tables (`DataTable`) are built for server-side pagination/sorting/filtering — the `manualPagination`, `manualSorting`, `manualFiltering` props and `onPaginationChange`, `onSortingChange`, `onColumnFiltersChange` callbacks are already wired. Just pass real values from TanStack Query.

### Environment
- `.env` should have: `VITE_API_BASE_URL`, `VITE_SENTRY_DSN`, `VITE_SENTRY_ENV`, `VITE_ENABLE_SENTRY_LOGS`, `VITE_SENTRY_SEND_DEFAULT_PII`, `VITE_SENTRY_MASK_ALL_TEXT`, `VITE_SENTRY_BLOCK_ALL_MEDIA`.
- Already partially set up in `main.tsx`.
