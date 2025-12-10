# Noteflow

## Overview

Noteflow is a notes and recurring tasks application built as a mobile-first web app with Android APK deployment support. The application allows users to create, manage, and organize notes with rich text editing, labels, and PIN protection. It also includes a recurring tasks system with customizable frequencies and reminders. The app works offline-first with local storage and optionally syncs to Supabase when configured.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for auth and theme
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables for light/dark mode support
- **Rich Text**: TipTap editor for note content with formatting support
- **Animations**: Framer Motion for smooth UI transitions

### Backend Architecture
- **Runtime**: Node.js with Express server
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod for type-safe validation

### Data Storage Strategy
- **Offline-First**: LocalForage (IndexedDB wrapper) for offline data persistence
- **Cloud Sync**: Optional Supabase integration for authenticated user data sync
- **Security**: PIN-protected notes use SHA-256 hashing stored locally only (not synced to cloud)

### Authentication
- **Provider**: Supabase Auth with Google OAuth support
- **Configuration**: Server provides Supabase credentials via `/api/config` endpoint
- **Fallback**: App works fully offline without authentication

### Mobile Deployment
- **Framework**: Capacitor for native Android wrapper
- **Build**: Codemagic CI/CD for APK generation
- **Web Assets**: Built from Vite output in `dist/public`

### Key Design Patterns
- **Offline-First Storage**: All data stored locally first, then synced when online and authenticated
- **Soft Deletes**: Deleted items marked with `isDeleted` flag for sync reconciliation
- **Pending Sync Queue**: Items marked with `pendingSync` flag until successfully synced to cloud

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations stored in `/migrations` directory

### Third-Party Services
- **Supabase**: Optional cloud backend for authentication and data sync
  - `SUPABASE_URL`: Supabase project URL
  - `SUPABASE_ANON_KEY`: Public anonymous key for client-side access
  - Tables: `notes`, `tasks` for cloud storage

### Build & Deployment
- **Capacitor**: Android native wrapper (app ID: `com.noteflow.app`)
- **Codemagic**: CI/CD service for Android APK builds

### Key NPM Packages
- `localforage`: IndexedDB abstraction for offline storage
- `@supabase/supabase-js`: Supabase client SDK
- `@tiptap/react`: Rich text editor
- `framer-motion`: Animation library
- `drizzle-orm`: Type-safe ORM for PostgreSQL