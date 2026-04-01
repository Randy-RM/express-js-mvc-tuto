[← Back to README](../README.md)

# Tech Stack & Packages

## Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| **express** | ^5.2.1 | Web framework — routing, middleware pipeline, async error handling (v5) |
| **@prisma/client** | ^7.5.0 | Prisma ORM — type-safe database queries, schema definition, migrations |
| **@prisma/adapter-pg** | ^7.6.0 | PostgreSQL driver adapter for Prisma 7 |
| **pg** | ^8.20.0 | PostgreSQL client for Node.js |
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
| **swagger-jsdoc** | ^6.2.8 | Generate OpenAPI 3.0 spec from JSDoc annotations |
| **swagger-ui-express** | ^5.0.1 | Serve interactive Swagger UI documentation |

## Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| **prisma** | ^7.5.0 | Prisma CLI — schema management, migrations, client generation |
| **ts-node-dev** | ^2.0.0 | Development server with hot reload & TypeScript transpilation |
| **ts-node** | ^10.9.2 | TypeScript execution for seeders and scripts |
| **eslint** | ^8.57.0 | Code linting |
| **@typescript-eslint/\*** | ^8.57.1 | TypeScript-specific ESLint rules |
| **@types/\*** | various | TypeScript type definitions for all runtime dependencies |
| **@types/swagger-jsdoc** | ^6.0.4 | TypeScript types for swagger-jsdoc |
| **@types/swagger-ui-express** | ^4.1.8 | TypeScript types for swagger-ui-express |

## Package Relationships

```
                    ┌──────────────┐
                    │   express    │  Core framework
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴──────┐
    │  helmet   │   │   cors    │   │ rate-limit │  Security & CORS
    └───────────┘   └───────────┘   └────────────┘
          
    ┌───────────┐   ┌───────────┐   ┌────────────┐
    │ passport  │──▶│passport-jwt│──▶│jsonwebtoken│  Authentication
    └───────────┘   └───────────┘   └────────────┘

    ┌───────────┐   ┌───────────┐
    │    prisma      │   │  bcrypt   │  Data & Security
    │  (PostgreSQL)  │   └───────────┘
    └───────────────┘

    ┌───────────────┐  ┌───────────┐  ┌───────────┐
    │express-validator│  │nodemailer │  │  dotenv   │  Utilities
    └───────────────┘  └───────────┘  └───────────┘

    ┌───────────────┐  ┌───────────────────┐
    │ swagger-jsdoc │──▶│swagger-ui-express │  API Documentation
    └───────────────┘  └───────────────────┘
```

---

[← Back to README](../README.md)
