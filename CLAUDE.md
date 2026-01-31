# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A wedding RSVP website built with React 19, TypeScript, Vite, and Supabase. The app features a countdown timer, location information with Google Maps embed, and a guest confirmation form with Brazilian Portuguese validation.

## Development Commands

```bash
# Start development server
# Always assume dev server is running. Only run unless otherwise told so
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Environment Setup

The app requires a `.env.local` file with Supabase credentials. Copy from `.env.example`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

**Important**: Environment variables are validated at application startup via `src/schemas/env.ts`. If validation fails, the app will throw an error and exit. The env schema is imported in `main.tsx` to ensure validation happens before the app renders.

## Architecture

### Environment & Configuration

- **`src/schemas/env.ts`**: Zod schema for environment variables with `validateEnv()` function. Exports a singleton `env` object that is validated at import time.
- **`src/services/supabase/client.ts`**: Supabase client singleton initialized with validated env variables. Import this file to access Supabase.

### Component Structure

```
src/
├── components/
│   ├── layout/       # Structural components (Header, Main)
│   └── ui/           # Reusable UI components (Countdown, InputForm, Location, Welcome, ToastContainer)
├── schemas/          # Zod validation schemas (env, guestSchema)
├── services/         # External service clients (Supabase)
└── utils/            # Utility functions (toast helpers)
```

### Key Patterns

1. **Environment Validation**: Env vars are validated at startup via side-effect import in `main.tsx`. Access via `env` from `src/schemas/env.ts`.

2. **Form Validation**: Forms use `react-hook-form` with `@hookform/resolvers` for Zod schema integration. The `guestSchema` in `src/schemas/guestSchema.ts` contains Brazilian phone (DDD validation) and name/email validation rules.

3. **Toast Notifications**: Use `src/utils/toast.ts` for consistent toast messages. `ToastContainer` component is rendered in `App.tsx`.

4. **Smooth Scrolling**: Navigation uses `react-scroll` for in-page scrolling to sections (home, location, rsvp).

### TypeScript Configuration

- Strict mode enabled
- `noUnusedLocals` and `noUnusedParameters` enforced
- JSX set to `react-jsx` (new JSX transform)

## Portuguese Language

The UI, validation messages, and comments are in Brazilian Portuguese. When adding new features, maintain consistency with existing Portuguese language patterns.
