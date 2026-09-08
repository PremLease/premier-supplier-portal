# Premier Supplier Portal

Deployable Next.js prototype for Premier Leasing & Finance.

## What is included

- Demo supplier login
- Supplier dashboard
- Supplier-specific finance calculator
- Customer quote creation
- Quote history
- Premier admin view
- Responsive Premier red/white styling

## Important prototype note

This is a front-end prototype. Login, quote storage and rate-card security are currently simulated in the browser. Before real supplier use, move authentication, supplier rate cards and saved quotes into a secure server-side database.

The Crime Prevention Services sample uses the factors already supplied for the prototype. The two other suppliers are clearly labelled demo suppliers and their rates are fictional.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Deploy to Vercel

1. Upload these files to the `PremLease/premier-supplier-portal` GitHub repository.
2. In Vercel, choose **Add New > Project**.
3. Import `PremLease/premier-supplier-portal`.
4. Vercel should detect **Next.js** automatically.
5. Click **Deploy**.
6. Once live, you can connect `portal.premlease.co.uk` in the Vercel project domain settings.

## Recommended production phase

For the real portal, add:

- Supabase/Postgres database
- Real supplier authentication
- Role-based permissions
- Server-side rate-card storage
- Versioned rate cards and effective dates
- Immutable quote snapshots
- PDF quote generation
- Email notifications
- Admin import for supplier rates

## Finance logic caution

Before moving the calculator into production, confirm the precise equipment-cost band rules used by each supplier rate card. The existing CPS workbook appears to have a possible mismatch between one displayed cost band and the formula used at £25k–£50k. The production portal should use explicit min/max bands rather than copying ambiguous spreadsheet logic.
