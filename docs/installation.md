[← Back to README](../README.md)

# Installation & Configuration

## Prerequisites

- **Node.js** >= 18.x
- **Yarn** package manager
- **PostgreSQL** instance (local or remote)

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
   - Set `DATABASE_URL` to your PostgreSQL connection string

4. Push the schema to the database:
   ```bash
   npx prisma db push
   ```

5. Seed the database:
   ```bash
   yarn seed
   ```

6. Start the development server:
   ```bash
   yarn dev
   ```

The API will be available at `http://localhost:8000/api`.

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Compile TypeScript to JavaScript (`./dist`) |
| `yarn prod` | Run the compiled production build |
| `yarn seed` | Seed the database with initial roles |
| `yarn prisma:generate` | Generate the Prisma client |
| `yarn prisma:studio` | Open Prisma Studio (DB GUI) |
| `yarn lint` | Run ESLint on all TypeScript files |
| `yarn lint:fix` | Run ESLint and auto-fix issues |
| `yarn format` | Format all TypeScript files with Prettier |

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/miniblog` |
| `API_HOST` | Allowed API origin (production) | `https://api.example.com` |
| `CLIENT_HOST` | Allowed client origin (production) | `https://example.com` |
| `SESSION_SECRET` | Session encryption secret | Random string |
| `JWT_SECRET` | JWT signing secret | Random string |
| `ADMIN_SECRET_SIGNUP_PARAMS_ROUTE` | Secret param for admin signup | Random string |
| `NODEMAILER_SERVICE` | Email service provider | `Gmail` / `mailhog` |
| `NODEMAILER_USER` | Email sender address | `user@gmail.com` |
| `NODEMAILER_PASS` | Email sender password | `password` |

## Production Build

To build and run for production:

```bash
yarn build        # Compiles TypeScript to ./dist
yarn prod         # Runs the compiled JavaScript
```

Make sure `NODE_ENV=production` is set in your `.env` file for production. This enables:
- Strict CORS origin checking (only `API_HOST` and `CLIENT_HOST` allowed)
- Production email service (e.g., Gmail instead of Mailhog)

---

[← Back to README](../README.md)
