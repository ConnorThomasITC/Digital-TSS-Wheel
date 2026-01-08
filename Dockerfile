# syntax=docker/dockerfile:1

# ---- Base Node image ----
FROM node:20-alpine AS base

# Install dependencies needed for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++ libc6-compat

# ---- Dependencies stage ----
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# ---- Builder stage ----
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Initialize database and build the application
RUN npm run db:push
RUN npm run db:seed
RUN npx next build

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the database initialization scripts and data directory
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/init-db.js ./src/lib/init-db.js
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/seed.js ./src/lib/seed.js
COPY --from=builder --chown=nextjs:nodejs /app/data ./data

# Create data directory with proper permissions (for persistent volume mounting)
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Set default environment variables
ENV DATABASE_PATH=/app/data/tss-wheel.db
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
