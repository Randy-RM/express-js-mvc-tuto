[← Back to README](../README.md)

# API Endpoints

All endpoints are prefixed with `/api`.

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register a new user |
| POST | `/signup/:adminRouteParams` | No | Register an admin (secret param) |
| GET | `/activate-account/:uniqueString` | No | Activate user account |
| POST | `/signin` | No | Login and receive JWT token |
| POST | `/recover-account` | No | Recover account (not implemented) |
| GET | `/logout` | No | Logout user |
| POST | `/delete-account` | No | Delete account (not implemented) |

### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response `201`:
```json
{
  "success": true,
  "status": 201,
  "message": "User created"
}
```

### Signin

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response `200`:
```json
{
  "success": true,
  "status": 200,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "username": "john_doe",
      "email": "john@example.com",
      "userRole": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Users (`/api/users`)

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| GET | `/` | Yes | Admin | List all users (paginated) |
| GET | `/:userId` | Yes | Owner/Admin | Get one user |
| POST | `/` | Yes | Admin | Create a user |
| PUT | `/:userId` | Yes | Owner/Admin | Update a user |
| DELETE | `/:userId` | Yes | Owner/Admin | Delete a user |
| DELETE | `/` | Yes | Admin | Delete all users |

### Get All Users

```http
GET /api/users?limit=10&cursor=665a1b2c3d4e5f6a7b8c9d0e
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "success": true,
  "status": 200,
  "message": "Users found",
  "data": {
    "nextCursor": "665a1b2c3d4e5f6a7b8c9d1f",
    "prevCursor": "665a1b2c3d4e5f6a7b8c9d0e",
    "totalResults": 10,
    "data": [...]
  }
}
```

### Create User (Admin only)

```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_user",
  "email": "new@example.com",
  "password": "securePassword123",
  "role": "moderator"
}
```

Response `201`:
```json
{
  "success": true,
  "status": 201,
  "message": "User created",
  "data": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "username": "new_user",
    "email": "new@example.com",
    "role": "moderator",
    "isUserActive": true,
    "createdAt": "2026-03-22T10:00:00.000Z",
    "updatedAt": "2026-03-22T10:00:00.000Z"
  }
}
```

---

## Articles (`/api/articles`)

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| GET | `/` | No | — | List all articles (paginated, filterable) |
| GET | `/:articleId` | No | — | Get one article |
| GET | `/:userId/articles` | Yes | Admin/Moderator | Get user's articles |
| POST | `/` | Yes | Admin | Create an article |
| PUT | `/:articleId` | Yes | Admin/Moderator | Update an article |
| DELETE | `/:articleId` | Yes | Admin/Moderator | Delete an article |
| DELETE | `/` | Yes | Admin | Delete all articles |

### Get All Articles

Supports cursor-based pagination and filters:

```http
GET /api/articles?limit=10&isPublished=true&isArchived=false
```

Response `200`:
```json
{
  "success": true,
  "status": 200,
  "message": "Articles found",
  "data": {
    "nextCursor": "665a1b2c3d4e5f6a7b8c9d1f",
    "prevCursor": null,
    "totalResults": 10,
    "data": [
      {
        "_id": "665a1b2c3d4e5f6a7b8c9d0e",
        "title": "My Article",
        "summary": "A short summary",
        "createdAt": "2026-03-22T10:00:00.000Z",
        "user": {
          "username": "admin",
          "email": "admin@example.com"
        }
      }
    ]
  }
}
```

### Create Article (Admin only)

```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Article",
  "summary": "A brief summary of the article",
  "content": "Full article content goes here..."
}
```

Response `201`:
```json
{
  "success": true,
  "status": 201,
  "message": "Article created",
  "data": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "title": "My New Article",
    "summary": "A brief summary of the article",
    "content": "Full article content goes here...",
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

---

## Pagination

The API uses **cursor-based pagination** for list endpoints. Query parameters:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `cursor` | string | — | MongoDB ObjectId to start after |
| `limit` | number | 10 | Number of results per page |

The response includes `nextCursor` and `prevCursor` for navigating between pages.

## Error Responses

All errors follow a standardized format:

```json
{
  "success": false,
  "status": 401,
  "message": "Invalid email or password"
}
```

Common status codes:
- `400` — Bad request
- `401` — Unauthorized (invalid/missing token)
- `403` — Forbidden (insufficient role)
- `404` — Resource not found
- `422` — Validation error
- `429` — Too many requests (rate limited)
- `500` — Internal server error

---

[← Back to README](../README.md)
