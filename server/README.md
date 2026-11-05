# Easy-Drive — Server

The API server for **Easy-Drive**, a full-stack car rental web application built as a portfolio project. Built with Node.js, Express and MongoDB, it exposes a full REST API for managing cars, categories, users, rentals, payments and contact requests — including authentication, role-based authorization and transactional emails.

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
| Email delivery | [Brevo](https://www.brevo.com/) transactional email API (via `fetch`) |
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
    ├── sendEmail.js            # Sends emails via the Brevo API
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
| `BREVO_API_KEY` | Brevo API key for sending emails |
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
| GET | `/cars` | Public | All cars |
| GET | `/cars/available` | Public | Cars available for a date/time range (`pickupDate`, `pickupTime`, `returnDate`, `returnTime`) |
| GET | `/cars/:id` | Public | Car by ID |
| POST | `/cars` | Admin | Add a car |
| PATCH | `/cars/:id` | Admin | Update a car |
| DELETE | `/cars/:id` | Admin | Delete a car |

### `/categories`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | All categories |
| GET | `/categories/:id` | Public | Category by ID |
| POST | `/categories` | Admin | Add a category |
| PATCH | `/categories/:id` | Admin | Update a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

### `/rentals`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/rentals` | Admin | All rentals |
| GET | `/rentals/my-rentals` | Auth | The logged-in user's rentals |
| GET | `/rentals/update-rental-statuses` | Public* | Automatic status update (protected by `CRON_SECRET`, see below) |
| GET | `/rentals/:id` | Auth | Rental by ID |
| POST | `/rentals` | Auth | Create a new rental |
| PATCH | `/rentals/:id` | Admin | Update a rental |
| DELETE | `/rentals/:id` | Admin | Delete a rental (admin) |
| PATCH | `/rentals/:id/cancel` | Auth | Cancel a rental |
| PATCH | `/rentals/:id/extend` | Auth | Extend a rental |
| PATCH | `/rentals/:id/complete` | Admin | Mark a rental as completed |
| PATCH | `/rentals/:id/status` | Admin | Manually change a rental's status |

### `/users`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | All users |
| GET | `/users/:id` | Auth | User by ID |
| POST | `/users` | Admin | Add a user (by an admin) |
| PATCH | `/users/:id` | Admin | Update a user |
| DELETE | `/users/:id` | Admin | Delete a user |

### `/payments`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/payments` | Admin | All payments |
| GET | `/payments/:id` | Auth | Payment by ID |
| POST | `/payments` | Admin | Add a payment to an existing rental |
| PATCH | `/payments/:id` | Admin | Update a payment's status |

### `/contact`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/contact` | Public | Submit the contact form |
| GET | `/contact` | Admin | All contact requests |
| PATCH | `/contact/:id` | Admin | Update a contact request's status |
| DELETE | `/contact/:id` | Admin | Delete a contact request |

### General
| Method | Path | Description |
|---|---|---|
| GET | `/ping` | Health check — used to keep the server awake on hosting services like Render |

---

## Background Jobs / Cron

The `GET /rentals/update-rental-statuses` endpoint is meant to be called by an external scheduler (e.g. cron-job.org) to keep statuses in sync with the clock:

- `confirmed` rentals whose pickup time has arrived become `active`, and their car becomes `rented`.
- `active` rentals past their planned return date become `overdue`.

The request must include the secret in the `Authorization` header (it is not accepted in the URL, so it doesn't end up in server logs):

```
Authorization: Bearer <CRON_SECRET>
```

---

## Email Delivery

Emails are sent via the **Brevo** transactional email API (`utils/sendEmail.js`), using ready-made HTML templates from `utils/emailTemplates.js` — including booking confirmations and password resets. The sender address is controlled via `EMAIL_USER`.

Emails go over Brevo's HTTPS API rather than SMTP, since Render's free tier blocks outbound SMTP ports. All emails pass through `sendEmail`, so switching providers only means changing that one function and its environment variables.

---

This server backs the Easy-Drive client, deployed at: [https://easydrive-app.vercel.app/](https://easydrive-app.vercel.app/)
