# Easy-Drive

Easy-Drive is a full-stack online car rental platform. Customers can search for available cars, book a rental through a guided multi-step flow, and manage their bookings from a personal account, while admins get a complete dashboard for managing cars, categories, users, rentals, payments and contact requests.

**Live app:** [https://easydrive-app.vercel.app/](https://easydrive-app.vercel.app/)

---

## Repository Structure

This is a monorepo with two independent projects:

| Directory | Description | Docs |
|---|---|---|
| [`client/`](client) | React 19 + Vite frontend — customer booking flow and admin dashboard | [client/README.md](client/README.md) |
| [`server/`](server) | Node.js/Express + MongoDB REST API — auth, business logic, email delivery | [server/README.md](server/README.md) |

Each has its own tech stack, environment variables, and setup instructions — see the linked READMEs for full details.

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite, Redux Toolkit, React Router, CSS Modules |
| Backend | Node.js, Express 5, MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Email | SendGrid |
| Deployment | Vercel (client), Render (server) |

---

## Key Features

- Car search with date/time-based availability and filters
- Multi-step rental flow: personal details → payment → review → confirmation
- Authentication: register, login, forgot/reset password via emailed link
- Personal profile and rental history management
- Full admin dashboard: cars, categories, users, rentals, payments, contact requests

---

## Getting Started

Each project is set up and run independently:

```bash
# Backend
cd server
npm install
node app.js

# Frontend (in a separate terminal)
cd client
npm install
npm run dev
```

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for required environment variables and full setup details.
