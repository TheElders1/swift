# SwiftSurge Logistics

SwiftSurge is a Next.js logistics website with a redesigned public site and the existing shipment operations, Supabase authentication, tracking, shipment history, trash, maps, and three shipment PDF formats.

## Run locally

Use Node.js 20 or newer, install the project dependencies, and start the development server:

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and enter the Supabase project URL, publishable key, and eventual site URL. Keep `.env.local` out of Git.

## Supabase

Use the SQL files in `supabase/` for the schema and the later database updates. They are written as separate migrations; run the base schema once, then apply only migration files whose changes are not already in the project. Add the administrator through Supabase Authentication and the `public.admin_users` allow-list as described by the SQL/setup instructions.

## Brand setup

The public site uses midnight navy `#0B1F33`, surge blue `#1479FF`, energy lime `#B8E82F`, ice white `#F5F8FC`, and slate `#607080`. The supplied transparent SwiftSurge logo is used across the site, PDF documents, and the 1200×630 social preview. The favicon uses a simplified mark derived from the brand palette. Replace the sample support email and any temporary contact details with the customer's approved information before launch.

Set `NEXT_PUBLIC_SITE_URL` to the production domain in Vercel so canonical, Open Graph, and Twitter metadata use the correct host. The Vercel deployment hostname is used as a fallback.
