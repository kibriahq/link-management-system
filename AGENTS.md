<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Functional Requirements

- Dynamic URL system for NFC and QR codes
- Unique short URLs with editable destinations
- Log scan/tap events with timestamps
- Support 1,000+ URLs initially, scalable to 100,000+
- Admin tools for bulk URL generation
- CSV export for URLs
- User assignment to URLs/items
- User dashboard with login
- Dashboard: list items, total scans/taps, last activity, editable destinations
- Subdomain architecture: redirection + dashboard

## Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js 16.2.4 (App Router)
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (not yet integrated)
- **Package Manager:** pnpm

## Architecture

- `/app` - Pages and routes (Next.js App Router)
- `/components` - UI components (to be created)
- `/lib` - Data fetching / utilities (to be created)

## Routes

- `/` - Dashboard
- `/manage` - URL Management
- `/generate/bulk` - Bulk Generator
- `/analytics` - Analytics
- `/settings` - Settings

## Commands

```bash
pnpm dev      # Dev server at http://localhost:3000
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # Run ESLint
```

**Note:** No `typecheck` or `test` scripts currently configured.

## Important Notes

- Uses **pnpm** (not npm/yarn)
- Next.js 16 has breaking changes from older versions - check `node_modules/next/dist/docs/`
- Supabase backend not yet integrated - frontend-only implementation
- ESLint 9 with flat config (eslint.config.mjs)
- TypeScript strict mode enabled