# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spotify clone built with Next.js 15, TypeScript, and the Spotify Web API. The project is **mid-migration from Pages Router to App Router** — the `app/` directory holds the active routes while `pages/` retains only `_app.tsx` and `_document.js` as scaffolding.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Serve production build
```

No test framework is configured.

## Tech Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS 3** for styling
- **NextAuth v4** with Spotify OAuth provider
- **Recoil** for client-side state (atoms in `atoms/`)
- **spotify-web-api-node** as the Spotify API client
- **@headlessui/react** and **@heroicons/react** for UI primitives

## Architecture

### Routing (App Router)

- `app/layout.tsx` → root layout wrapping `<Providers>`
- `app/providers.tsx` → `"use client"` boundary providing `SessionProvider` + `RecoilRoot`
- `app/(main)/layout.tsx` → applies the shell layout (sidebar + header + player)
- `app/(main)/` → all authenticated routes (home, search, collection/*, users/*)
- `app/login/page.tsx` → server component login page
- `app/api/auth/[...nextauth]/route.js` → NextAuth handler

### Authentication Flow

1. `middleware.ts` checks JWT via `getToken()` on every request; redirects unauthenticated users to `/login`
2. NextAuth JWT callback stores `accessToken`, `refreshToken`, `username`, and `accessTokenExpires`
3. Token auto-refresh happens in the JWT callback when expired
4. `useSpotify` hook detects `RefreshAccessTokenError` and calls `signIn()` to re-authenticate

Required env vars (see `.env.example`): `NEXTAUTH_URL`, `SPOTIFY_ID`, `SPOTIFY_SECRET`, `JWT_SECRET`

### Spotify API Client Pattern

A singleton `SpotifyWebApi` instance is created in `lib/spotify.ts`. The `useSpotify` hook sets the access token from the session on each render and returns the configured instance. Components consume it via `useSpotify()`.

### State Management (Recoil)

- `atoms/trackAtom.ts` — `trackIdState`, `isPlayingState`, `seekState`
- `atoms/playlistAtom.ts` — `playlistIdState`, `playlistState`, `myPlaylists`

### Component Layout

- `components/layout/Layout.tsx` — shell: sidebar + header + fixed player bar
- `components/layout/player/` — Player, LeftSide, Center (seek), RightSide (volume)
- `components/layout/sidebar/` — Sidebar, Profile, SearchInput, Navigation, MyPlaylists
- `components/shared/` — reusable: Card, Cards, CurrentCard, Track, Tracks (infinite scroll via IntersectionObserver)
- Feature components: `components/album/`, `components/artist/`, `components/playlist/`, `components/search/`, `components/user/`, `components/collection/`

### Key Patterns

- **Debouncing**: `lodash.debounce` + `useCallback` for search (200ms), seek (100ms), volume (200ms)
- **`classNames` helper**: defined locally in multiple components (not shared) — `(...classes: string[]) => classes.filter(Boolean).join(' ')`
- **Custom Tailwind classes**: `.btn-play` and `.btn-player` defined in `styles/globals.css`
- Never ever call variables shortened or with single letter, always make them with full name

## Code Style

Enforced via Prettier (`prettier.config.js`):
- No semicolons
- Single quotes
- 2-space tabs
- Arrow parens always

TypeScript: `strict: true` but `noImplicitAny: false`.

## Known Issues

- `tailwind.config.js` content paths are missing `'./app/**/*.{js,ts,jsx,tsx}'` — Tailwind may purge classes used in app router files during production builds
- Some components import `useRouter` from `next/router` instead of `next/navigation` (App Router)
- Sidebar navigates to `/playlist/${id}` (old Pages route) instead of `/collection/playlists/${id}`
