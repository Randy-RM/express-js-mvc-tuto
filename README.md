# Express.js MVC Blog API

<img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="28"><img src="https://emojis.slackmojis.com/emojis/images/1531849430/4246/blob-sunglasses.gif?1531849430" width="28"/>

A RESTful blog API built with **Express.js 5**, **TypeScript**, **PostgreSQL** (via **Prisma ORM 7**) and **Passport.js**. This project follows the **MVC + Service Layer** design pattern with role-based access control.

> This application is a simple blog API with role-based authentication (user, moderator, admin).

> **A note for you, fellow developer** — This project exists for one simple reason: to help you learn, grow, and get better at backend development with Express.js. Whether you're just getting started or looking to level up your skills in software architecture, clean code, and best practices, this codebase is designed to be explored, studied, and used freely for your personal projects. Every folder, every layer, every pattern here is meant to be understood — not just copied. Take your time, read through the code, follow the documentation, and make it your own. If you have a thirst for knowledge, you're in the right place.

---

## Table of Contents

| # | Section | Description |
|---|---|---|
| 1 | [Project Architecture](docs/architecture.md) | Directory structure, layers, and how they connect |
| 2 | [Tech Stack & Packages](docs/tech-stack.md) | All dependencies with their purpose and relationships |
| 3 | [How the Application Works](docs/how-it-works.md) | Middleware pipeline, authentication flow, RBAC, error handling |
| 4 | [Request Lifecycle Example](docs/request-lifecycle.md) | Step-by-step walkthrough of a `POST /api/articles` request |
| 5 | [API Endpoints](docs/api-endpoints.md) | All routes with auth requirements, roles, and examples |
| 6 | [Installation & Configuration](docs/installation.md) | Setup guide, scripts, and environment variables |
| 7 | [Commit Conventions](docs/commit-conventions.md) | Commit message format, examples, and pre-commit hooks |

---

## Quick Start

```bash
git clone https://github.com/Randy-RM/express-js-mvc-tuto.git
cd express-js-mvc-tuto
yarn install
# Rename sample.env to .env and configure your variables
yarn seed
yarn dev
```

The API will be available at `http://localhost:8000/api`.
The Swagger documentation will be available at `http://localhost:8000/api-docs`.

---

## Overview

### Tech Stack

| Technology | Purpose |
|---|---|
| **Express.js 5** | Web framework with async error handling |
| **TypeScript 5** | Static typing with strict mode |
| **PostgreSQL + Prisma 7** | Database & ORM |
| **Passport.js + JWT** | Authentication |
| **bcrypt** | Password hashing |
| **express-validator** | Input validation |
| **Helmet + CORS + Rate Limit** | Security |

### Architecture

```
Routes  →  Middlewares  →  Validators  →  Controllers  →  Services  →  Models
                                                                          ↕
                                                                      PostgreSQL
```

### Roles

| Role | Access Level |
|---|---|
| **user** | Read articles, manage own account |
| **moderator** | + update/delete articles |
| **admin** | Full access |

---

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Compile TypeScript to `./dist` |
| `yarn prod` | Run the production build |
| `yarn seed` | Seed the database |
| `yarn prisma:generate` | Generate the Prisma client |
| `yarn prisma:studio` | Open Prisma Studio (DB GUI) |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Run ESLint with auto-fix |
| `yarn format` | Format with Prettier |

---

> For detailed documentation, see the [docs/](docs/) folder.
>
> You can use this project as a base example for getting started with your backend projects using Node.js, Express.js & TypeScript.
