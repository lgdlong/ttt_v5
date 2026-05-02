# Build stage
FROM node:24.15.0-alpine AS builder

WORKDIR /app

# Accept VITE_API_URL as build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files from frontend directory
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies using npm (more reliable for Docker builds)
RUN npm ci

# Copy source code
COPY frontend/ .

# Build app
RUN npm run build

# Production stage - serve static files (Traefik handles routing)
FROM node:24.15.0-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start serve (Traefik routes /* to this container on port 3000)
CMD ["serve", "-s", "dist", "-l", "3000"]
