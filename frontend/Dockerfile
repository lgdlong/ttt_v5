# Build stage
FROM node:24.15.0-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build the application
RUN pnpm run build

# Production stage - serve static files (Traefik handles routing)
FROM node:24.15.0-alpine

# Install serve to serve static files
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && \
    pnpm add -g serve

WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist ./dist

# Expose port (Vite default dev port, but serve listens on this)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start serve (Traefik routes /* to this container on port 3000)
CMD ["serve", "-s", "dist", "-l", "3000"]
