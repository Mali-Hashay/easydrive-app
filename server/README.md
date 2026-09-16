# Easy-Drive — Server

The API server for **Easy-Drive**, an online car rental platform. Built with Node.js, Express and MongoDB, it exposes a full REST API for managing cars, categories, users, rentals, payments and contact requests — including authentication, role-based authorization and transactional emails.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication & Authorization](#authentication--authorization)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Background Jobs / Cron](#background-jobs--cron)
- [Email Delivery](#email-delivery)

---

## Tech Stack

| Area | Library |
|---|---|
| Server | [Express 5](https://expressjs.com/) |
| Database | [MongoDB](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/) |
| Authentication | [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) + [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| Email delivery | [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail) |
| Dates & time zones | [dayjs](https://day.js.org/) (with `utc` / `timezone` plugins, `Asia/Jerusalem` zone) |
| Configuration | [dotenv](https://www.npmjs.com/package/dotenv) |
| CORS | [cors](https://www.npmjs.com/package/cors) |

The project is written as **ES Modules** (`"type": "module"` in `package.json`).

---

## Project Structure

```
server/
├── app.js                     # Entry point - Express setup, DB connection, router registration
├── controllers/                # Business logic per entity
│   ├── auth.controller.js
│   ├── cars.controller.js
│   ├── categories.controller.js
│   ├── contact.controller.js
│   ├── payments.controller.js
│   ├── rentals.controller.js
│   └── users.controller.js
├── routers/                    # Route definitions wired to controllers
├── models/                     # Mongoose schemas
├── middlewares/
│   └── auth.middleware.js      # verifyToken + verifyAdmin
├── services/
│   └── paymentService.js       # Creates payments and links them to a rental
└── utils/
    ├── sendEmail.js            # Sends emails via SendGrid
    └── emailTemplates.js       # HTML email templates (booking confirmation, password reset...)
```

---

## Getting Started

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#environment-variables)), then run:

```bash
node app.js
```

The server listens on `http://localhost:5000` (or the port set via `PORT`) and connects automatically to the MongoDB instance defined by `MONGO_URI`.

---

## Environment Variables

Create a `.env` file at the root of the server with the following variables:

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `CLIENT_URL` | URL of the client app (used in email links, e.g. password reset) |
| `SENDGRID_API_KEY` | SendGrid API key for sending emails |
| `EMAIL_USER` | Sender email address shown on outgoing emails |
| `ADMIN_EMAIL` | Admin's email address (e.g. to receive contact form submissions) |
| `CRON_SECRET` | Secret key protecting the endpoint that auto-updates rental statuses |

> Note: the `.env` file is excluded from the repo (`.gitignore`) — set it up locally and on the deployment environment (Render, etc.).

---

## Authentication & Authorization

Authentication is handled via **JWT**, sent in the header:

```
Authorization: Bearer <token>
```

Two main middlewares (`middlewares/auth.middleware.js`):

- **`verifyToken`** — validates the token, loads the user from the DB and attaches it to `req.user`. It also checks whether the password was changed after the token was issued (`passwordChangedAt`) and rejects stale tokens accordingly.
- **`verifyAdmin`** — runs after `verifyToken` and ensures `req.user.role === 'admin'`.

Possible user roles: `customer` (default), `staff`, `admin`.

---

## Data Models

### User (`users`)
`firstName`, `lastName`, `email` (unique), `password` (hashed), `phoneNumber`, `idNumber`, `licenseNumber`, `birthDate`, `role` (`customer`/`staff`/`admin`), `status` (`active`/`inactive`/`blocked`), `passwordChangedAt`.

### Car (`cars`)
`brand`, `model`, `licensePlate` (unique), `year`, `categories` (array of `Category` refs), `seats`, `transmission` (`automatic`/`manual`), `fuelType` (`electric`/`hybrid`/`gasoline`/`diesel`), `mileage`, `dailyPrice`, `status` (`available`/`rented`/`maintenance`/`inactive`), `imageUrl`.

### Category (`categories`)
`name`, `status` (`active`/`inactive`).

### Rental (`rentals`)
`clientId`, `carId`, `pickupDate`, `plannedReturnDate`, `actualReturnDate`, `driversBirthDate`, `driversIdNumber`, `licenseNumber`, `totalPrice`, `payments` (array of `Payment` refs), `status` (`confirmed`/`active`/`completed`/`cancelled`/`overdue`/`deleted`). Includes `timestamps`.

### Payment (`payments`)
`rentalId`, `status` (`pending`/`authorized`/`paid`/`failed`/`refunded`/`partial_refund`/`cancelled`), `paymentMethod` (`cash`/`credit_card`/`debit_card`/`bank_transfer`/`paypal`/`apple_pay`/`google_pay`), `sum`, `paymentNumber`, `transactionId`. Includes `timestamps`.

### Contact (`contacts`)
`name`, `email`, `phone`, `message`, `createdAt`, `status` (`pending`/`handled`).

---

## API Endpoints

> Access legend — **Public**: no authentication required | **Auth**: requires a valid token (`verifyToken`) | **Admin**: requires the `admin` role (`verifyAdmin`)

### `/auth`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Log in |
| POST | `/auth/forgot-password` | Public | Send a password reset email |
| POST | `/auth/reset-password/:id/:token` | Public | Reset password via token |
| GET | `/auth/me` | Auth | Get the logged-in user's details |
| PATCH | `/auth/me` | Auth | Update the logged-in user's profile |
| PATCH | `/auth/change-password` | Auth | Change password |

### `/cars`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/cars/getAll` | Public | All cars |
| GET | `/cars/getById/:id` | Public | Car by ID |
| GET | `/cars/availableCars` | Public | Cars available for a date/time range (`pickupDate`, `pickupTime`, `returnDate`, `returnTime`) |
| POST | `/cars/add` | Admin | Add a car |
| PATCH | `/cars/update/:id` | Admin | Update a car |
| DELETE | `/cars/delete/:id` | Admin | Delete a car |

### `/categories`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/categories/getAll` | Public | All categories |
| GET | `/categories/getById/:id` | Public | Category by ID |
| POST | `/categories/add` | Admin | Add a category |
| PATCH | `/categories/update/:id` | Admin | Update a category |
| DELETE | `/categories/delete/:id` | Admin | Delete a category |

### `/rentals`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/rentals/getAll` | Admin | All rentals |
| GET | `/rentals/getById/:id` | Auth | Rental by ID |
| GET | `/rentals/my-rentals` | Auth | The logged-in user's rentals |
| POST | `/rentals/add` | Auth | Create a new rental |
| PATCH | `/rentals/update/:id` | Auth | Update a rental |
| PATCH | `/rentals/cancel/:id` | Auth | Cancel a rental |
| PATCH | `/rentals/extend/:id` | Auth | Extend a rental |
| PATCH | `/rentals/complete/:id` | Admin | Mark a rental as completed |
| DELETE | `/rentals/delete/:id` | Admin | Delete a rental (admin) |
| GET | `/rentals/update-rental-statuses` | Public* | Automatic status update (protected by `CRON_SECRET`, see below) |

### `/users`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/users/getAll` | Admin | All users |
| GET | `/users/getById/:id` | Auth | User by ID |
| POST | `/users/add` | Admin | Add a user (by an admin) |
| PATCH | `/users/update/:id` | Auth | Update a user |
| DELETE | `/users/delete/:id` | Admin | Delete a user |

### `/payments`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/payments/getAll` | Admin | All payments |
| GET | `/payments/getById/:id` | Auth | Payment by ID |
| POST | `/payments/add` | Auth | Add a payment to an existing rental |
| PATCH | `/payments/update/:id` | Admin | Update a payment's status |

### `/contact`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/contact/submit-form` | Public | Submit the contact form |
| GET | `/contact/getAll` | Admin | All contact requests |
| PATCH | `/contact/update-status/:id` | Admin | Update a contact request's status |
| DELETE | `/contact/delete/:id` | Admin | Delete a contact request |

### General
| Method | Path | Description |
|---|---|---|
| GET | `/ping` | Health check — used to keep the server awake on hosting services like Render |

---

## Background Jobs / Cron

The `GET /rentals/update-rental-statuses` endpoint is meant to be called by an external scheduler (e.g. a cron job on the hosting service) to automatically flip rentals past their planned return date to `overdue`. The request must include a secret key matching `CRON_SECRET`.

---

## Email Delivery

Emails are sent via **SendGrid** (`utils/sendEmail.js`), using ready-made HTML templates from `utils/emailTemplates.js` — including booking confirmations and password resets. The sender address is controlled via `EMAIL_USER`.

---

This server backs the Easy-Drive client, deployed at: [https://easydrive-app.vercel.app/](https://easydrive-app.vercel.app/)
