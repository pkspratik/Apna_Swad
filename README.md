# Apna Swad - Vercel-ready Backend (Serverless)

This folder contains serverless API routes to deploy on Vercel under `/api` path.

## Setup on Vercel Dashboard
1. Create a Vercel project linked to your GitHub repo (or deploy from local).
2. Add environment variables in Project → Settings → Environment Variables:
   - `FIREBASE_KEY`  (copy full service account JSON here, JSON must be valid)
   - `JWT_SECRET`

## Endpoints
- POST /api/auth/signup       -> create user (email+password)
- POST /api/auth/login        -> email+password -> returns { user, token }
- POST /api/orders            -> create order (auth required)
- GET  /api/orders            -> admin: list all orders
- GET  /api/orders/:id        -> get order (owner/seller/admin)
- PUT  /api/orders/:id/status -> seller/admin update order status
- GET  /api/orders/seller/list -> seller's orders
- GET  /api/orders/user/list   -> user's orders

## Notes
- Uses Firebase Admin SDK via `FIREBASE_KEY` env var.
- Tokens are standard JWT signed with `JWT_SECRET` and include `{ id, role }`.
- Do not commit your service account JSON to git.
