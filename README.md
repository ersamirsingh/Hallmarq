# Hallmarq — Store Rating Platform

Hallmarq is a full-stack web application for discovering and rating retail stores, restaurants, and local businesses on a 1-to-5 star scale with role-based access control, weighted Bayesian-style store rankings, and verified customer reviews.

---

## Architecture Overview

- **Frontend:** React 18, Vite, Tailwind CSS v3 (light, dark, system theme), React Router 6, TanStack Query, React Hook Form with Zod validation, Recharts, Lucide React, and Sonner.
- **Backend:** Node.js 20+, Express 5, TypeScript (strict), Prisma ORM, Zod validation, Pino structured logging, and Nodemailer.
- **Database:** PostgreSQL 16 on Supabase or Docker with custom schema constraints.
- **Security:** Strict Helmet Content Security Policy, CORS allowlisting, cross-site httpOnly SameSite cookie authentication, origin verification, and rate limiting.

---

## Seed Accounts & Testing Credentials

The database reset and seed script populates 1 Administrator, 5 Store Owners with assigned stores, 3 Normal Users, and realistic store ratings:

### 1. System Administrator
- **Email:** `admin@hallmarq.com`
- **Password:** `Admin@123`
- **Role:** Administrator (Access to dashboard statistics, user management, store assignments, and category management)

### 2. Store Owners & Stores
All store owner accounts use password: `Owner@123`

| Owner Email | Owner Name | Assigned Store | Category |
|---|---|---|---|
| `owner1@hallmarq.com` | Oliver Bennett | The Rustic Coffeehouse | Cafe |
| `owner2@hallmarq.com` | Sophia Rodriguez | Bella Cucina Trattoria | Restaurant |
| `owner3@hallmarq.com` | Marcus Vance | Green Valley Organics | Grocery |
| `owner4@hallmarq.com` | Elena Rostova | TechNova Electronics | Electronics |
| `owner5@hallmarq.com` | David Kim | Serenity Spa & Salon | Salon |

### 3. Normal Users
All normal user accounts use password: `User@123`

| User Email | User Name | Address |
|---|---|---|
| `user1@hallmarq.com` | Alexander Mitchell | 12 Maple Leaf Street, Apt 3B |
| `user2@hallmarq.com` | Charlotte Sterling | 45 Sunset Boulevard, West End |
| `user3@hallmarq.com` | Benjamin Walker | 78 Pinecrest Road, North Quarter |

---

## Hosting Deployment Guide

### A. Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository: `https://github.com/ersamirsingh/Hallmarq.git`.
3. Configure the Web Service settings:
   - **Name:** `hallmarq-api`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add the following **Environment Variables** in Render:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default, Render sets this automatically)
   - `DATABASE_URL`: Your Supabase pooler URL with `?pgbouncer=true`
   - `DIRECT_URL`: Your Supabase direct connection URL on port 5432
   - `JWT_SECRET`: Random string with 32+ characters
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://hallmarq.vercel.app` or `https://*.vercel.app`)
   - `TRUST_PROXY`: `1`
   - `REQUIRE_EMAIL_VERIFICATION`: `false`
5. Click **Create Web Service**.
6. Once deployed, run the seed script from Render Shell or locally pointing `DATABASE_URL` to the database:
   ```bash
   npm run seed
   ```

### B. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** ➔ **Project**.
2. Import your GitHub repository: `https://github.com/ersamirsingh/Hallmarq.git`.
3. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the **Environment Variable**:
   - `VITE_API_URL`: Your Render backend API endpoint (e.g. `https://hallmarq-api.onrender.com/api`)
5. Click **Deploy**.

---

## Local Development Setup

### 1. Backend Server
```bash
cd server
npm install
npx prisma db push
npm run seed
npm run dev
```
Server starts on `http://localhost:5000`.

### 2. Frontend Client
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Client starts on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.
