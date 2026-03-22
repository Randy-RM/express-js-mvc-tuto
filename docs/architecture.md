[← Back to README](../README.md)

# Project Architecture

The project follows a layered **MVC + Service** architecture:

```
src/
├── server.ts                  # Application entry point & Express configuration
├── config/
│   ├── database.config.ts     # MongoDB connection via Mongoose
│   ├── passport.config.ts     # Passport JWT strategy configuration
│   ├── paths.config.ts        # Base URI constants for routes
│   └── swagger.config.ts      # Swagger/OpenAPI specification configuration
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
├── docs/
│   └── swagger/
│       ├── auth.swagger.ts    # Swagger annotations for auth endpoints
│       ├── users.swagger.ts   # Swagger annotations for user endpoints
│       └── articles.swagger.ts# Swagger annotations for article endpoints
└── validators/
    └── index.ts               # Request validation schemas (express-validator)
```

## Layer Responsibilities

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

## How They Connect

```
Routes  →  Middlewares  →  Validators  →  Controllers  →  Services  →  Models
                                                                          ↕
                                                                       Database
```

1. **Routes** define the HTTP method + path and attach the middleware chain
2. **Middlewares** handle authentication (Passport JWT) and authorization (role check)
3. **Validators** validate and sanitize incoming request data
4. **Controllers** are thin — they extract data from the request, call the appropriate service, and send the response
5. **Services** contain all business logic and interact with **Models** to perform database operations
6. **Models** define the MongoDB document schemas via Mongoose

---

[← Back to README](../README.md)
