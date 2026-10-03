# Haat - React client (Phase 2 + Admin)

Vite + React storefront for the MERN e-commerce API from Phase 1.

## Run locally
```bash
cd client
cp .env.example .env      # only needed if your API isn't on http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```
Backend must be running on port 5000 first (see server/README.md), and `CLIENT_URL` in the server's `.env` must be `http://localhost:5173`.

## Shopper pages
- `/` — product grid with category filter, price range, sort and pagination (all in the URL, so links are shareable)
- `/product/:id` — product detail, add to cart with quantity
- `/cart` — persisted in localStorage, survives refresh
- `/login`, `/register`
- `/checkout` (protected) — shipping address, COD, order summary
- `/orders`, `/orders/:id` (protected) — order history and status tracker

## Admin dashboard
Log in with `admin@example.com` / `admin123` and an **Admin** link appears in the navbar.
- `/admin` — quick stats (products, orders, revenue, orders awaiting processing)
- `/admin/products` — list, add, edit, delete products
- `/admin/orders` — list all orders, change status (processing → shipped → delivered, or cancel)

All of this uses the admin-only endpoints already built in Phase 1 — no backend changes were needed.

## Design notes
Palette: indigo `#1B2559`, marigold `#F5B700`, clay `#C1440E` on a warm paper background — an Indian bazaar ("haat") feel, with a price "sticker" on each product tile. Display type is Bricolage Grotesque, body is Figtree.

## Try it
```
user@example.com / user123
admin@example.com / admin123
```

## Roadmap
- [x] Phase 1: API
- [x] Phase 2: React client
- [x] Phase 3a: Admin dashboard (product + order management)
- [ ] Phase 3b: Razorpay payment (test mode)
- [ ] Phase 4: Deploy (Atlas + Render + Vercel)
