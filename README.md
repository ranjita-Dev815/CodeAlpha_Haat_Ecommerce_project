# Haat — MERN E-Commerce

A full-stack e-commerce web application built with MongoDB, Express, React, and Node.js. Built as part of the CodeAlpha Full Stack Development Internship.

## 🔗 Live Demo

- **Website:** https://code-alpha-haat-ecommerce-project.vercel.app
- **Backend API:** https://haat-backend-gyaw.onrender.com/api/health

> Note: the backend is hosted on Render's free tier, so the first request after a period of inactivity may take 30–60 seconds while the server wakes up.

### Try it out
User login: user@example.com / user123
Admin login: admin@example.com / admin123


## Features

**Shopping**
- Product catalogue with search, category filters, price range, and sorting
- Product detail pages
- Cart (persists across page refresh)
- Checkout with shipping address and cash-on-delivery
- Order history and order tracking

**Account**
- Register / login with JWT authentication
- Protected routes for checkout, orders, and admin pages

**Admin dashboard**
- Sales/orders/products overview
- Product management (add, edit, delete)
- Order management (view all orders, update status)

## Tech Stack

- **Frontend:** React, React Router, Vite, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT, bcrypt
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure
ecommerce-mern/
├── client/ # React frontend (Vite)
└── server/ # Express REST API


## Run locally

**Backend**
```bash
cd server
cp .env.example .env     # add your MongoDB URI and JWT secret
npm install
npm run seed              # optional: creates demo users and products
npm run dev                # http://localhost:5000
```

**Frontend** (in a separate terminal)
```bash
cd client
npm install
npm run dev                # http://localhost:5173
```

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/products | public |
| GET | /api/products/:id | public |
| POST / PUT / DELETE | /api/products[/:id] | admin |
| POST | /api/orders | user |
| GET | /api/orders/mine | user |
| GET | /api/orders | admin |
| PUT | /api/orders/:id/status | admin |

## Author

**Ranjita Kumari** — CodeAlpha Full Stack Development Intern
