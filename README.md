# MERN E-Commerce

Full-stack e-commerce app. **Phase 1 (this folder): REST API** with JWT auth, role-based access, product catalogue, and orders.

## Run locally
```bash
cd server
cp .env.example .env      # set MONGO_URI (local or Atlas) and a long JWT_SECRET
npm install
npm run seed              # admin@example.com / admin123, user@example.com / user123, 12 products
npm run dev               # http://localhost:5000
```

## API
| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | /api/auth/register | public | name, email, password |
| POST | /api/auth/login | public | returns JWT |
| GET | /api/auth/me | user | |
| GET | /api/products | public | `keyword, category, minPrice, maxPrice, sort (newest/price_asc/price_desc), page, limit` |
| GET | /api/products/categories | public | |
| GET | /api/products/:id | public | |
| POST / PUT / DELETE | /api/products[/:id] | admin | |
| POST | /api/orders | user | `{ orderItems: [{product, qty}], shippingAddress, paymentMethod }` |
| GET | /api/orders/mine | user | |
| GET | /api/orders/:id | owner/admin | |
| GET | /api/orders | admin | paginated |
| PUT | /api/orders/:id/status | admin | processing / shipped / delivered / cancelled |

Send the token as `Authorization: Bearer <token>`.

## Quick test
```bash
curl -X POST localhost:5000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'
curl "localhost:5000/api/products?keyword=shoes&sort=price_asc"
```

## Design decisions (good interview talking points)
- Prices, names and totals are computed **server-side** from DB values; the client only sends product ids and quantities.
- Stock is decremented with an **atomic conditional update** (`stock >= qty`) so concurrent buyers can't oversell; failed orders roll stock back.
- Order items store a **snapshot** of name/price so history doesn't change when a product is edited.
- Passwords hashed with bcrypt (cost 12); role can never be set from the register body; inputs are type-checked against NoSQL injection; helmet, CORS allow-list, rate limiting on auth.

## Roadmap
- [x] Phase 1: API (auth, products, orders)
- [ ] Phase 2: React client (Vite): product list, search/filter, cart, login, checkout, order history
- [ ] Phase 3: Razorpay payment (test mode) + admin dashboard
- [ ] Phase 4: Deploy (MongoDB Atlas, Render, Vercel) + README screenshots
