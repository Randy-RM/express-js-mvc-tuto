# Tech Stack & Packages

## Runtime Dependencies

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

## Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| **typescript** | ^5.9.3 | TypeScript compiler — strict mode, ES2020 target |
| **ts-node-dev** | ^2.0.0 | Development server with hot reload & TypeScript transpilation |
| **ts-node** | ^10.9.2 | TypeScript execution for seeders and scripts |
| **eslint** | ^8.57.0 | Code linting |
| **@typescript-eslint/\*** | ^8.57.1 | TypeScript-specific ESLint rules |
| **@types/\*** | various | TypeScript type definitions for all runtime dependencies |

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
    │ mongoose  │   │  bcrypt   │  Data & Security
    └───────────┘   └───────────┘

    ┌───────────────┐  ┌───────────┐  ┌───────────┐
    │express-validator│  │nodemailer │  │  dotenv   │  Utilities
    └───────────────┘  └───────────┘  └───────────┘
```

---

[← Back to README](../README.md)
