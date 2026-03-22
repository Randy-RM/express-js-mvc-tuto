# Express.js MVC Blog API

<img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="28"><img src="https://emojis.slackmojis.com/emojis/images/1531849430/4246/blob-sunglasses.gif?1531849430" width="28"/>

A RESTful blog API built with **Express.js 5**, **TypeScript**, **MongoDB** and **Passport.js**. This project follows the **MVC + Service Layer** design pattern with role-based access control.

> This application is a simple blog API with role-based authentication (user, moderator, admin).

---

## Table of Contents

- [Project Architecture](#project-architecture)
- [Tech Stack & Packages](#tech-stack--packages)
- [How the Application Works](#how-the-application-works)
- [Request Lifecycle Example](#request-lifecycle-example)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)

---

## Project Architecture

The project follows a layered **MVC + Service** architecture:

```
src/
├── server.ts                  # Application entry point & Express configuration
├── config/
│   ├── database.config.ts     # MongoDB connection via Mongoose
│   ├── passport.config.ts     # Passport JWT strategy configuration
│   └── paths.config.ts        # Base URI constants for routes
├── constants/
│   └── index.ts               # Application constants (ROLES enum)
├── controllers/
│   ├── article.controller.ts  # Article request/response handling
│   ├── auth.controller.ts     # Authentication request/response handling
│   └── user.controller.ts     # User request/response handling
├── middlewares/
│   ├── auth.middleware.ts      # Role-based authorization middleware
│   ├── error.middleware.ts     # Global error handler
│   ├── logger.middleware.ts    # Colored request logger
│   └── index.ts               # Barrel export
├── models/
│   ├── article.model.ts       # Mongoose Article schema & model
│   ├── user.model.ts          # Mongoose User schema & model
│   └── index.ts               # Barrel export
├── routes/
│   ├── articles.routes.ts     # Article route definitions
│   ├── auth.routes.ts         # Auth route definitions
│   ├── users.routes.ts        # User route definitions
│   └── index.ts               # Route aggregator
├── seeders/
│   └── role.seeders.ts        # Database seed script for roles
├── services/
│   ├── article.service.ts     # Article business logic & DB operations
│   ├── auth.service.ts        # Auth business logic (signup, signin, JWT)
│   ├── user.service.ts        # User business logic & DB operations
│   └── index.ts               # Barrel export
├── types/
│   └── index.ts               # TypeScript interfaces & type declarations
├── utils/
│   ├── authorization.util.ts  # Role checking & ownership verification
│   ├── email.util.ts          # Email sending via Nodemailer
│   ├── randomString.util.ts   # Secure random string generator
│   ├── throwError.util.ts     # Custom error throwing helper
│   └── index.ts               # Barrel export
└── validators/
    └── index.ts               # Request validation schemas (express-validator)
```

### Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **Routes** | Define endpoints, attach middlewares (auth, validation), delegate to controllers |
| **Middlewares** | Cross-cutting concerns: logging, authentication, authorization, error handling |
| **Validators** | Input validation & sanitization using express-validator |
| **Controllers** | Extract request data (`params`, `body`, `query`), call services, format HTTP responses |
| **Services** | Business logic, database operations, authorization checks — framework-independent |
| **Models** | Mongoose schemas, data shape, instance methods (e.g. password comparison) |
| **Utils** | Shared helper functions (error throwing, email, role checks) |
| **Types** | TypeScript interfaces (`IUser`, `IArticle`, `ApiResponse`, `AppError`) |
| **Config** | Application configuration (DB connection, Passport strategy, route paths) |

---

## Tech Stack & Packages

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| **express** | ^5.2.1 | Web framework — routing, middleware pipeline, async error handling (v5) |
| **mongoose** | ^9.3.1 | MongoDB ODM — schema definition, validation, queries, population |
| **passport** | ^0.7.0 | Authentication framework — pluggable strategies |
| **passport-jwt** | ^4.0.1 | JWT authentication strategy for Passport |
| **jsonwebtoken** | ^9.0.3 | JWT token creation & verification for stateless auth |
| **bcrypt** | ^6.0.0 | Password hashing with salt rounds (12 rounds) |
| **helmet** | ^8.1.0 | Security headers (XSS protection, content-type sniffing, etc.) |
| **cors** | ^2.8.6 | Cross-Origin Resource Sharing — controls allowed origins |
| **express-rate-limit** | ^8.3.1 | Rate limiting — 100 requests per 15 minutes per IP |
| **express-validator** | ^7.3.1 | Request body/params/query validation & sanitization |
| **dotenv** | ^17.3.1 | Environment variable loading from `.env` file |
| **nodemailer** | ^8.0.3 | Email sending (account activation, recovery) |

### Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| **typescript** | ^5.9.3 | TypeScript compiler — strict mode, ES2020 target |
| **ts-node-dev** | ^2.0.0 | Development server with hot reload & TypeScript transpilation |
| **ts-node** | ^10.9.2 | TypeScript execution for seeders and scripts |
| **eslint** | ^8.57.0 | Code linting |
| **@typescript-eslint/**** | ^8.57.1 | TypeScript-specific ESLint rules |
| **@types/**** | various | TypeScript type definitions for all runtime dependencies |

---

## How the Application Works

### Middleware Pipeline

Every incoming request passes through this middleware chain in order:

```
Client Request
  │
  ▼
┌─────────────────┐
│  express.json()  │  Parse JSON body (max 10kb)
└────────┬────────┘
         ▼
┌─────────────────┐
│      CORS       │  Check origin against allowed list
└────────┬────────┘
         ▼
┌─────────────────┐
│     Helmet      │  Set security HTTP headers
└────────┬────────┘
         ▼
┌─────────────────┐
│  Rate Limiter   │  Block if > 100 req / 15 min
└────────┬────────┘
         ▼
┌─────────────────┐
│Passport.init()  │  Initialize Passport (JWT strategy)
└────────┬────────┘
         ▼
┌─────────────────┐
│     Logger      │  Log method, URL, status code, duration (colored)
└────────┬────────┘
         ▼
┌─────────────────┐
│     Router      │  Match route → run route-specific middlewares
└────────┬────────┘
         ▼
┌─────────────────┐
│ Error Handler   │  Catch errors, return standardized JSON response
└─────────────────┘
```

### Authentication Flow

1. **Signup** (`POST /api/auth/signup`) — Hashes password with bcrypt, creates user with a unique activation string
2. **Account Activation** (`GET /api/auth/activate-account/:uniqueString`) — Activates user account
3. **Signin** (`POST /api/auth/signin`) — Verifies email/password, returns a JWT token (1h expiry)
4. **Protected Routes** — Client sends `Authorization: Bearer <token>` header. Passport's JWT strategy extracts and validates the token, attaches the user to `req.user`
5. **Authorization** — The `authorize([roles])` middleware checks if `req.user.role` is in the allowed roles list

### Role-Based Access Control

| Role | Permissions |
|---|---|
| **user** | Read articles, manage own account |
| **moderator** | All user permissions + update/delete articles |
| **admin** | Full access — manage users, articles, and system resources |

---

## Request Lifecycle Example

Here is a concrete example showing the full journey of a `POST /api/articles` request (creating a new article):

### 1. Client sends the request

```http
POST /api/articles HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "My First Article",
  "summary": "An introduction to Express.js",
  "content": "Express.js is a minimal and flexible Node.js web framework..."
}
```

### 2. Global middlewares process the request

```
express.json()       → Parses JSON body into req.body
cors()               → Validates the request origin
helmet()             → Adds security headers to the response
rateLimiter          → Checks rate limit (passes if < 100 req/15min)
passport.initialize()→ Sets up Passport for this request
logger               → Starts a timer, will log on response finish
```

### 3. Router matches the route

The request matches `POST /api/articles` defined in `articles.routes.ts`:

```typescript
articleRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),  // Step 4
  authorize([ROLES.ADMIN]),                           // Step 5
  createArticleValidation,                            // Step 6
  createArticle                                       // Step 7
);
```

### 4. Passport JWT Authentication

`passport.authenticate("jwt")` middleware:
- Extracts the Bearer token from the `Authorization` header
- Verifies the JWT signature using `JWT_SECRET`
- Finds the user by email (from token payload) in the database
- Attaches the user document to `req.user`
- If the token is invalid or expired → returns `401 Unauthorized`

### 5. Role Authorization

`authorize([ROLES.ADMIN])` middleware:
- Reads `req.user.role`
- Checks if the role is in the allowed list `["admin"]`
- If not authorized → throws `403 Forbidden`

### 6. Input Validation

`createArticleValidation` (express-validator chain):
- Validates `title` is a non-empty string (3-200 chars)
- Validates `summary` is a non-empty string
- Validates `content` is a non-empty string
- If validation fails → returns `422 Unprocessable Entity` with error details

### 7. Controller handles the request

`createArticle` in `article.controller.ts`:
```typescript
export async function createArticle(req, res, next) {
  try {
    const userId = String((req.user as IUser)._id);
    const { title, summary, content } = req.body;
    const article = await articleService.create(userId, { title, summary, content });

    res.status(201).json({
      success: true,
      status: 201,
      message: "Article created",
      data: article,
    });
  } catch (error) {
    next(error);  // → forwards to error handler middleware
  }
}
```

### 8. Service executes business logic

`articleService.create()` in `article.service.ts`:
- Finds the user by ID in the database
- Creates the article document via `ArticleModel.create()`
- Populates the `user` field (username, email)
- Returns the populated article

### 9. Response sent to client

```json
{
  "success": true,
  "status": 201,
  "message": "Article created",
  "data": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "title": "My First Article",
    "summary": "An introduction to Express.js",
    "content": "Express.js is a minimal and flexible Node.js web framework...",
    "isPublished": false,
    "isArchived": false,
    "user": {
      "username": "admin",
      "email": "admin@example.com"
    },
    "createdAt": "2026-03-22T10:30:00.000Z",
    "updatedAt": "2026-03-22T10:30:00.000Z"
  }
}
```

### 10. Logger outputs to console

```
[2026-03-22T10:30:00.123Z] POST    201 http://localhost:8000/api/articles 45ms
```

### Error Case

If any step fails (e.g., validation error, unauthorized, database error), the error propagates via `next(error)` to the **global error handler** middleware, which returns:

```json
{
  "success": false,
  "status": 422,
  "message": "Validation failed",
  "data": [
    { "field": "title", "message": "Title must be between 3 and 200 characters" }
  ]
}
```

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register a new user |
| POST | `/signup/:adminRouteParams` | No | Register an admin (secret param) |
| GET | `/activate-account/:uniqueString` | No | Activate user account |
| POST | `/signin` | No | Login and receive JWT token |
| POST | `/recover-account` | No | Recover account (not implemented) |
| GET | `/logout` | No | Logout user |
| POST | `/delete-account` | No | Delete account (not implemented) |

### Users (`/api/users`)

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| GET | `/` | Yes | Admin | List all users (paginated) |
| GET | `/:userId` | Yes | Owner/Admin | Get one user |
| POST | `/` | Yes | Admin | Create a user |
| PUT | `/:userId` | Yes | Owner/Admin | Update a user |
| DELETE | `/:userId` | Yes | Owner/Admin | Delete a user |
| DELETE | `/` | Yes | Admin | Delete all users |

### Articles (`/api/articles`)

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| GET | `/` | No | — | List all articles (paginated, filterable) |
| GET | `/:articleId` | No | — | Get one article |
| GET | `/:userId/articles` | Yes | Admin/Moderator | Get user's articles |
| POST | `/` | Yes | Admin | Create an article |
| PUT | `/:articleId` | Yes | Admin/Moderator | Update an article |
| DELETE | `/:articleId` | Yes | Admin/Moderator | Delete an article |
| DELETE | `/` | Yes | Admin | Delete all articles |

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Randy-RM/express-js-mvc-tuto.git
   cd express-js-mvc-tuto
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Configure environment variables:
   - Rename `sample.env` to `.env`
   - Uncomment all variables
   - Set `MONGOHQ_URL` to your MongoDB connection string

4. Seed the database:
   ```bash
   yarn seed
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

The API will be available at `http://localhost:8000/api`.

---

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Compile TypeScript to JavaScript (`./dist`) |
| `yarn prod` | Run the compiled production build |
| `yarn seed` | Seed the database with initial roles |
| `yarn lint` | Run ESLint on all TypeScript files |
| `yarn lint:fix` | Run ESLint and auto-fix issues |
| `yarn format` | Format all TypeScript files with Prettier |

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `MONGOHQ_URL` | MongoDB connection string | `mongodb://localhost:27017/miniblog` |
| `API_HOST` | Allowed API origin (production) | `https://api.example.com` |
| `CLIENT_HOST` | Allowed client origin (production) | `https://example.com` |
| `SESSION_SECRET` | Session encryption secret | Random string |
| `JWT_SECRET` | JWT signing secret | Random string |
| `ADMIN_SECRET_SIGNUP_PARAMS_ROUTE` | Secret param for admin signup | Random string |
| `NODEMAILER_SERVICE` | Email service provider | `Gmail` / `mailhog` |
| `NODEMAILER_USER` | Email sender address | `user@gmail.com` |
| `NODEMAILER_PASS` | Email sender password | `password` |

---

> You can use this project as a base example for getting started with your backend projects using Node.js, Express.js & TypeScript.
