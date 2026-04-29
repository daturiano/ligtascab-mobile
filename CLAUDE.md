# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ligtascab is a commuter-facing mobile app for tricycle transportation in Naga City, Philippines. Commuters scan a tricycle's QR code to start a ride, view driver/vehicle details, file reports, trigger emergency alerts, and browse nearby terminals on a map.

## Commands

```bash
npm start              # Start Expo dev server
npm run ios            # Start on iOS simulator
npm run android        # Start on Android emulator
npm run lint           # ESLint + Prettier check
npm run format         # ESLint --fix + Prettier --write
npx tsc --noEmit       # Type-check without emitting
```

No test runner is configured.

## Architecture

### Routing (Expo Router, file-based)

`app/` uses Expo Router with two route groups that act as auth gates:

- `(authentication)/` — wrapped in `GuestViewOnly`, redirects authenticated users away. Contains: landing, login, sign-up, OTP verification, account setup, forgot/update password.
- `(private)/` — wrapped in `AuthenticatedViewOnly`, redirects unauthenticated users to `/`. Contains a tab navigator (`(tabs)/`: home, terminals, scan, history, profile) and modal screens (`in-ride`, `location-search`).

If `useRideStore.rideDetails` is non-null when the private layout mounts, the user is auto-redirected to `in-ride` (persistent ride session).

### Provider Stack (root `_layout.tsx`)

`AuthProvider` → `ThemeProvider` (Restyle) → `Stack`. The root layout also waits for both Google Fonts and Zustand hydration before hiding the splash screen.

`QueryClientProvider` (React Query) is instantiated separately inside both `(authentication)/_layout.tsx` and `(private)/_layout.tsx`, not at the root.

### State Management

- **Auth** — React Context (`src/context/AuthenticationContext.tsx`). Exposes `session`, `user` (Commuter), `signInWithPhoneNumber`, `signOutUser`, `isEmailVerified`. Auth state drives route guards.
- **Ride session** — Zustand with AsyncStorage persistence (`src/store/useRideStore.ts`). Stores the current ride's tricycle, ride, and report details. Persisted so ride survives app restart.
- **Terminal/directions** — Zustand, not persisted (`src/store/useTerminalStore.ts`). Origin/destination for map navigation and a "selecting on map" mode flag.
- **Server data** — React Query for paginated lists (rides, reports).

### Backend (Supabase)

All data operations go through `@supabase/supabase-js` with the client in `src/utils/supabase.ts`. Auth uses phone+password sign-in. Sessions persist via AsyncStorage and auto-refresh on app foreground.

Key Supabase tables: `commuters`, `tricycles`, `drivers`, `operators`, `rides`, `reports`, `review`.

Supabase Edge Functions (Deno) in `supabase/functions/`:
- `send-emergency-sms` — sends SMS via Semaphore API
- `send-otp` — called directly by URL from `src/services/authentication.ts`

### UI System (@shopify/restyle)

All layout/styling uses Restyle's theme-driven primitives. The theme is in `src/theme/theme.ts`.

- `Box`, `Text`, `Card`, `Button` — Restyle components in `src/components/ui/`. Use these instead of raw RN `View`/`Text`.
- `Button` supports `variant` (`primary`, `secondary`, `destructive`, `outline`, `ghost`, `disabled`) and `isLoading`.
- `Card` supports `variant` (`defaults`, `elevated`).
- Text variants: `header`, `subheader`, `body`, `bodyBold`, `description`, `details`, `title`.
- Fonts: Plus Jakarta Sans (headings), Nunito (body).
- Icons: `lucide-react-native`.

### Form Handling

React Hook Form + Zod. Schemas are in `src/schemas.ts`. Forms are in `src/components/forms/`.

### External APIs

- **Google Maps** — directions, geocoding, reverse geocoding, place autocomplete (`src/utils/directionsService.ts`). Requires `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`.
- **Semaphore** — SMS delivery, called from Supabase Edge Function. Requires `SEMAPHORE_API_KEY` (set as Supabase secret, not in `.env`).

### Environment Variables

Required in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

## Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`). Example: `import Box from '@/src/components/ui/Box'`.

## Code Style

- Prettier: 100 char line width, single quotes, trailing commas (es5), bracket same line.
- ESLint: expo flat config, `react/display-name` disabled.
- TypeScript strict mode.
