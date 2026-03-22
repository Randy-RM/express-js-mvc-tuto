# Request Lifecycle Example

Here is a concrete example showing the full journey of a `POST /api/articles` request (creating a new article).

## 1. Client sends the request

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

## 2. Global middlewares process the request

```
express.json()       → Parses JSON body into req.body
cors()               → Validates the request origin
helmet()             → Adds security headers to the response
rateLimiter          → Checks rate limit (passes if < 100 req/15min)
passport.initialize()→ Sets up Passport for this request
logger               → Starts a timer, will log on response finish
```

## 3. Router matches the route

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

## 4. Passport JWT Authentication

`passport.authenticate("jwt")` middleware:
- Extracts the Bearer token from the `Authorization` header
- Verifies the JWT signature using `JWT_SECRET`
- Finds the user by email (from token payload) in the database
- Attaches the user document to `req.user`
- If the token is invalid or expired → returns `401 Unauthorized`

## 5. Role Authorization

`authorize([ROLES.ADMIN])` middleware:
- Reads `req.user.role`
- Checks if the role is in the allowed list `["admin"]`
- If not authorized → throws `403 Forbidden`

## 6. Input Validation

`createArticleValidation` (express-validator chain):
- Validates `title` is a non-empty string (3-200 chars)
- Validates `summary` is a non-empty string
- Validates `content` is a non-empty string
- If validation fails → returns `422 Unprocessable Entity` with error details

## 7. Controller handles the request

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

The controller is **thin** — it only:
1. Extracts data from the request
2. Delegates business logic to the service
3. Formats and sends the HTTP response

## 8. Service executes business logic

`articleService.create()` in `article.service.ts`:
- Finds the user by ID in the database
- Creates the article document via `ArticleModel.create()`
- Populates the `user` field (username, email)
- Returns the populated article

```typescript
async create(userId: string, data: { title: string; summary: string; content: string }) {
  const user = await UserModel.findById(userId);
  if (!user) throwError(500, "Something went wrong");

  let article = await ArticleModel.create({ ...data, user });
  article = await article.populate({ path: "user", model: "User", select: { _id: 0, username: 1, email: 1 } });

  return article;
}
```

## 9. Response sent to client

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

## 10. Logger outputs to console

```
[2026-03-22T10:30:00.123Z] POST    201 http://localhost:8000/api/articles 45ms
```

## Visual Summary

```
Client
  │
  │  POST /api/articles + JWT + Body
  ▼
┌──────────────────────────────────────────────────┐
│                 Global Middlewares                │
│  json → cors → helmet → rateLimiter → passport   │
│                    → logger                      │
└─────────────────────┬────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────┐
│              Route-level Middlewares              │
│  passport.authenticate → authorize → validator   │
└─────────────────────┬────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────┐
│                   Controller                     │
│  Extract req data → call service → send response │
└─────────────────────┬────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────┐
│                    Service                       │
│  Business logic → Model operations → return data │
└─────────────────────┬────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────┐
│                Model (Mongoose)                  │
│  Schema validation → MongoDB query → Document    │
└──────────────────────────────────────────────────┘
```

## Error Case

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

[← Back to README](../README.md)
