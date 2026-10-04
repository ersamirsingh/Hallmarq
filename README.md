# Hallmarq — Store Rating Platform

Hallmarq is a full-stack web application for discovering and rating retail stores, restaurants, and local businesses on a 1-to-5 star scale with role-based access control, weighted Bayesian-style store rankings, and verified customer reviews.

---

## Architecture Overview

- **Frontend:** React 18, Vite, Tailwind CSS v3 (light, dark, system theme), React Router 6, TanStack Query, React Hook Form with Zod validation, Recharts, Lucide React, and Sonner.
- **Backend:** Node.js 20+, Express 5, TypeScript (strict), Prisma ORM, Zod validation, Pino structured logging, Nodemailer, and Swagger UI OpenAPI docs.
- **Database:** PostgreSQL 16 with custom SQL check constraints (`CHECK (value BETWEEN 1 AND 5)`).
- **Security:** Strict Helmet Content Security Policy, CORS allowlisting, Origin header validation, anti-automation tiered rate limiting, bcrypt password hashing with timing attack mitigation, and JWTs in httpOnly, SameSite cookies.
- **Email:** Nodemailer with Mailpit web UI for local email capture.

---

## Seed Accounts & Credentials

The database seed populates three default role accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| **System Administrator** | `admin@hallmarq.local` | `Admin@1234` | Full access to statistics, user management, and store assignments |
| **Normal User** | `alice.user.demo@hallmarq.local` | `User@1234` | Browse stores, submit 1-5 star ratings, and write reviews |
| **Store Owner** | `bob.owner.demo@hallmarq.local` | `Owner@1234` | Store dashboard, rating distribution, and raters list |

---

## Local Development Setup

### 1. Prerequisites
- Node.js 20+ installed
- Docker Desktop or a running PostgreSQL 16 instance
- Git

### 2. Database & Mail Containers
Start PostgreSQL and Mailpit using Docker Compose:
```bash
docker compose up -d postgres mailpit
```

### 3. Server Setup
```bash
cd server
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Client Setup
In a new terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

---

## Docker Compose (Production Deployment)

Run the entire platform with a single command:
```bash
docker compose up --build
```

- **Web Application:** `http://localhost:5173`
- **Backend API & Swagger Docs:** `http://localhost:5000/api/docs`
- **Mailpit Web Interface:** `http://localhost:8025`

---

## Environment Variable Reference

### Server Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `NODE_ENV` | Environment mode (`development`, `production`) | `development` |
| `DATABASE_URL` | PostgreSQL connection URI | - |
| `JWT_SECRET` | Secret key for JWT signing (minimum 32 characters) | - |
| `CLIENT_URL` | Comma-separated allowed CORS origins | `http://localhost:5173` |
| `TRUST_PROXY` | Number of reverse proxies in front of Express | `0` |
| `BCRYPT_COST` | Number of bcrypt salt rounds | `12` |
| `SMTP_HOST` | Outgoing SMTP mail server | `localhost` |
| `SMTP_PORT` | Outgoing SMTP port | `1025` |
| `MAIL_FROM` | Default sender email address | `noreply@hallmarq.local` |
| `REQUIRE_EMAIL_VERIFICATION` | Block unverified logins when true | `false` |
| `ENABLE_DOCS` | Enable Swagger UI at `/api/docs` | `true` |
| `LOG_LEVEL` | Pino logger verbosity level | `info` |

---

## API Documentation

Interactive OpenAPI 3.0 documentation generated dynamically from Zod schemas is available at:
`http://localhost:5000/api/docs` (Swagger UI) or `http://localhost:5000/api/docs.json` (raw OpenAPI specification).
