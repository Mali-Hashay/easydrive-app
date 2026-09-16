## Easy-Drive — Client

The frontend of Easy-Drive, an online car rental platform. Built with React 19 and Vite, it provides a full customer-facing booking experience (search, book, manage rentals, profile) and a complete admin dashboard for managing cars, categories, users, rentals, payments and contact requests.

**Live app:** [https://easydrive-app.vercel.app/](https://easydrive-app.vercel.app/)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## Tech Stack

| Area | Library |
|---|---|
| UI framework | [React 19](https://react.dev/) |
| Build tool | [Vite 8](https://vitejs.dev/) |
| Routing | [React Router 7](https://reactrouter.com/) |
| State management | [Redux Toolkit](https://redux-toolkit.js.org/) + [React Redux](https://react-redux.js.org/) |
| Icons & a few UI widgets | [MUI (Material UI)](https://mui.com/) + [Emotion](https://emotion.sh/) — used selectively (mostly icons, plus a couple of menu components), not as the app's overall design system |
| HTTP client | [Axios](https://axios-http.com/) |
| Dates | [dayjs](https://day.js.org/), [react-datepicker](https://reactdatepicker.com/) |
| Alerts / dialogs | [SweetAlert2](https://sweetalert2.github.io/) |
| Linting | [ESLint 10](https://eslint.org/) |

Styling is done with **CSS Modules** (`*.module.css`) scoped per component/page.

---

## Features

**Customer-facing:**
- Home page with hero banner, "how it works" and "why choose us" sections
- Car search by pickup/return date & time, with a dedicated results page and filters (category, transmission, fuel type, price, etc.)
- Multi-step rental flow: personal details → payment → review → confirmation
- Authentication: register, login, forgot/reset password (via emailed link)
- Personal profile management: edit info, change password
- "My Rentals" page: view active/past rentals, cancel or extend a rental
- Static pages: About, Contact, FAQ, Terms of Use, Privacy Policy, Accessibility Statement

**Admin dashboard** (`/admin`, protected by `AdminRoute`):
- Dashboard overview
- Cars management (CRUD, via a drawer form)
- Categories management
- Users management
- Rentals management (view, complete, delete)
- Payments management
- Contact requests management (view & update status)

---

## Project Structure

```
client/src/
├── api/                    # Axios instances + one file per resource (authApi, carsApi, rentalsApi...)
├── assets/                 # Static assets (images, icons)
├── components/
│   ├── admin/               # Admin tables rows, drawers (Car/Category/Payment/Rental/User), AdminRoute guard
│   ├── auth/                  # AuthModal + its Login, Register, ForgotPassword forms — not routed pages
│   ├── cars/                 # Car search results list, car card, filters, search summary
│   ├── common/                # Shared components (e.g. FAQ)
│   ├── home/                  # Home page sections (banner, how it works, why choose us)
│   ├── layout/                 # MainLayout/AdminLayout, Header, Footer, AdminSidebar/AdminFooter
│   ├── profile/                 # Personal info form, change password
│   ├── rental/
│   │   ├── modals/              # Rental-related modals
│   │   └── rental-steps/        # PersonalDetails, Payment, RentalReview, RentalSummary
│   └── ui/                      # Reusable UI primitives (LoadingSpinner, MultiSelectDropdown, ScrollToTop)
├── constants/                # Static data (branch data, i18n translations)
├── pages/
│   ├── admin/                 # Admin pages (Cars, Categories, Contacts, Dashboard, Payments, Rentals, Users)
│   └── publicPages/            # Public pages (Home, Search, Reset Password, Profile, MyRentals...)
├── store/
│   ├── slices/                 # Redux slices (auth, car, category, rental, rentalFlow, user)
│   └── store.js
├── utils/                    # alertService (SweetAlert2 wrapper), dateUtils, validators
├── App.jsx                   # Route definitions
└── main.jsx                  # App entry point
```

---

## Routing

### Public routes (`MainLayout`)
| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/search` | Search Car |
| `/search-results` | Search Results |
| `/rental` | Rental booking flow |
| `/my-rentals` | My Rentals |
| `/profile` | Profile |
| `/reset-password/:id/:token` | Reset Password |
| `/contact` | Contact |
| `/faq` | FAQ |
| `/terms` / `/privacy` / `/accessibility` | Legal / policy pages |

Login and Register are not routed pages — they're only ever rendered as tabs inside `AuthModal` (`components/auth/AuthModal.jsx`), which the `Header` opens on top of whatever page the user is on. After a password reset, the app navigates home and opens `AuthModal` directly to the login tab.

### Admin routes (`/admin`, guarded by `AdminRoute` + `AdminLayout`)
| Path | Page |
|---|---|
| `/admin` | Dashboard |
| `/admin/cars` | Cars management |
| `/admin/categories` | Categories management |
| `/admin/users` | Users management |
| `/admin/rentals` | Rentals management |
| `/admin/payments` | Payments management |
| `/admin/contacts` | Contact requests management |

`AdminRoute` restricts access to authenticated users with the `admin` role, redirecting everyone else.

---

## State Management

Global state is managed with **Redux Toolkit**, split into slices under `store/slices/`:

| Slice | Responsibility |
|---|---|
| `authSlice` | Current user, login/register/logout, session restoration from the stored JWT |
| `carSlice` | Cars list and CRUD for the admin panel |
| `categorySlice` | Categories list and CRUD |
| `rentalSlice` | Rentals list, "my rentals", cancel/extend/complete |
| `rentalFlowSlice` | Transient state of the multi-step booking flow (selected car, dates, driver details, payment) |
| `userSlice` | Users list and CRUD for the admin panel |

---

## API Layer

All HTTP calls go through `api/axiosClient.js`, which exposes two Axios instances:

- **`publicApi`** — for endpoints that don't require authentication (login, register, browsing cars, etc.)
- **`privateApi`** — attaches the JWT stored in `localStorage` (`Authorization: Bearer <token>`) to every request via a request interceptor.

Each backend resource has a matching API module (`authApi.js`, `carsApi.js`, `categoriesApi.js`, `contactApi.js`, `paymentsApi.js`, `rentalsApi.js`, `usersApi.js`), consumed by the Redux slices.

---

## Environment Variables

Create a `.env` file at the root of the `client/` directory:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000` in development) |

> Note: the `.env` file is excluded from the repo (`.gitignore`).

---

## Getting Started

```bash
cd client
npm install
npm run dev
```

The app will be available at the URL Vite prints (by default `http://localhost:5173`). Make sure the [server](../server/README.md) is running and `VITE_API_URL` points to it.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run the app in development mode with HMR |
| `npm run build` | Build the app for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |

---

## Deployment

The project is set up for deployment on **[Vercel](https://vercel.com/)**. `vercel.json` rewrites all routes to `index.html`, so client-side routing (React Router) works correctly on direct page loads and refreshes:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Make sure to set `VITE_API_URL` as an environment variable in your Vercel project settings, pointing to the deployed server URL.

The current production deployment is live at: [https://easydrive-app.vercel.app/](https://easydrive-app.vercel.app/)
