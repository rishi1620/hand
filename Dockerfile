# Use Node.js LMS as base image
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and code
COPY prisma ./prisma/
COPY . .

# Generate Prisma Client & Build Frontend/Backend
RUN npx prisma generate
RUN npm run build

# ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src/server ./src/server

EXPOSE 3000

CMD ["node", "server.ts"]
