# Backend Architecture & Deployment Guide

## 1. Architecture Overview
This application follows a **Modular Clean Architecture (Hexagonal)** approach, designed to scale easily and maintain strict separation of concerns.

### Architectural Layers:
1. **API / Transport Layer**: Handles HTTP protocols, Express routes, and input validation.
2. **Controller Layer**: Maps incoming requests to format inputs for the service layer and standardizes API responses.
3. **Service Layer (Use Cases)**: Contains core business logic isolated from external frameworks or database integrations.
4. **Repository Layer**: Abstraction over the ORM (Prisma) for database operations.
5. **Infrastructure Layer**: Third-party integrations (Redis, AWS S3, RabbitMQ).

![Clean Architecture](https://miro.medium.com/max/1400/1*ZnlhFhHtyAAYU2I0jW0LHA.png)

## 2. Folder Structure
```
/src/backend/
 â”œâ”€â”€ config/          # Environment configuration (Zod validations)
 â”œâ”€â”€ controllers/     # Route handlers mapping requests to services
 â”œâ”€â”€ middlewares/     # Express middlewares (auth, errors, rate tracking)
 â”œâ”€â”€ models/          # Domain interfaces & Types
 â”œâ”€â”€ modules/         # Feature-based routes
 â”œâ”€â”€ repositories/    # DB abstraction (Prisma clients)
 â”œâ”€â”€ services/        # Business logic & use cases
 â”œâ”€â”€ utils/           # Helpers, Loggers (Pino), Error classes
 â””â”€â”€ app.ts           # Express application setup
```

## 3. Tech Stack
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Caching**: Redis (Planned)
- **Validation**: Zod
- **Logger**: Pino
- **Security**: Helmet, bcryptjs, jsonwebtoken

## 4. Authentication Flow (JWT + Refresh Tokens)
1. User submits `POST /api/v1/auth/login` with email/password.
2. Backend verifies credentials against hashed password (bcrypt).
3. Backend generates:
   - `accessToken` (15m expiry, stateless).
   - `refreshToken` (7d expiry, stored in DB for revocation).
4. `accessToken` is returned in JSON; `refreshToken` in a secure `HttpOnly` cookie.
5. Clients provide `Authorization: Bearer <accessToken>`.
6. When token expires, client hits `POST /api/v1/auth/refresh` using cookie to obtain new `accessToken`.

## 5. Security & Compliance
- **GDPR & HIPAA Compliance Structure**: 
  - Data encryption at rest and in transit.
  - Audit logging middleware for sensitive mutations.
  - Granular RBAC (`patient`, `doctor`, `admin`).
- **CSRF & XSS**: Helmet blocks XSS. CSRF handled via token validation and same-site cookies.
- **Throttling**: Express rate limit (planned for API endpoints).

## 6. Standardized Response Format
```json
{
  "success": true,
  "data": { "key": "value" },
  "error": null
}
```

## 7. Deployment Guide
1. **Environment Config**: Create a `.env` file via `.env.example`. Ensure `DATABASE_URL` is set to a secure PostgreSQL cluster.
2. **Migrations**: Run `npx prisma migrate deploy` locally or in CI/CD.
3. **CI/CD Build**:
   ```bash
   npm run build # Builds React frontend via vite
   ```
4. **Start Service**:
   ```bash
   node server.ts # Starts Backend + serves static frontend
   ```
5. **Docker**: Use Dockerizing patterns (multi-stage builds) for Kubernetes or AWS ECS deployments. See included `Dockerfile`.
