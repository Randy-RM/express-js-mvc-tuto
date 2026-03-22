# How the Application Works

## Middleware Pipeline

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

## Authentication Flow

1. **Signup** (`POST /api/auth/signup`) — Hashes password with bcrypt, creates user with a unique activation string
2. **Account Activation** (`GET /api/auth/activate-account/:uniqueString`) — Activates user account
3. **Signin** (`POST /api/auth/signin`) — Verifies email/password, returns a JWT token (1h expiry)
4. **Protected Routes** — Client sends `Authorization: Bearer <token>` header. Passport's JWT strategy extracts and validates the token, attaches the user to `req.user`
5. **Authorization** — The `authorize([roles])` middleware checks if `req.user.role` is in the allowed roles list

### JWT Token Flow

```
Client                          Server
  │                               │
  │  POST /api/auth/signin        │
  │  { email, password }          │
  │──────────────────────────────▶│
  │                               │  Verify credentials
  │                               │  Sign JWT with email payload
  │  { token: "eyJhbG..." }      │
  │◀──────────────────────────────│
  │                               │
  │  GET /api/articles            │
  │  Authorization: Bearer eyJ... │
  │──────────────────────────────▶│
  │                               │  Extract token from header
  │                               │  Verify JWT signature
  │                               │  Find user by email
  │                               │  Attach user to req.user
  │  { data: [...] }              │
  │◀──────────────────────────────│
```

## Role-Based Access Control

| Role | Permissions |
|---|---|
| **user** | Read articles, manage own account |
| **moderator** | All user permissions + update/delete articles |
| **admin** | Full access — manage users, articles, and system resources |

### How Authorization Works

The `authorize` middleware is a higher-order function that takes an array of allowed roles:

```typescript
authorize([ROLES.ADMIN, ROLES.MODERATOR])
```

It checks if the authenticated user's role is included in the allowed list. If not, it throws a `403 Forbidden` error.

## Error Handling

All errors are caught by the global error handler middleware (`error.middleware.ts`). It returns a standardized JSON response:

```json
{
  "success": false,
  "status": 404,
  "message": "Article with id \"abc123\" not found"
}
```

Errors can originate from:
- **Validation failures** (422) — express-validator rejects the input
- **Authentication failures** (401) — Invalid or missing JWT token
- **Authorization failures** (403) — User role not in allowed list
- **Not found errors** (404) — Resource doesn't exist in database
- **Server errors** (500) — Unexpected errors

## Logger Output

The logger middleware outputs colored logs to the console:

```
[2026-03-22T10:30:00.123Z] GET     200 http://localhost:8000/api/articles 12ms
[2026-03-22T10:30:01.456Z] POST    201 http://localhost:8000/api/articles 45ms
[2026-03-22T10:30:02.789Z] DELETE  404 http://localhost:8000/api/articles/123 3ms
```

Color coding:
- **HTTP Methods**: GET (green), POST (cyan), PUT (yellow), PATCH (magenta), DELETE (red)
- **Status Codes**: 2xx (green), 3xx (blue), 4xx (yellow), 5xx (red)
- **Timestamp & Duration**: gray

---

[← Back to README](../README.md)
