# Build stage
FROM node:24.15.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY identity-service/package.json identity-service/package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
# Use cache mount to speed up subsequent builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source code
COPY identity-service/ .

# Build TypeScript
RUN npm run build

# Prune devDependencies to keep only production modules
RUN npm prune --omit=dev

# Production stage
FROM node:24.15.0-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy ONLY necessary files from builder
# Pruned node_modules are much smaller
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json .

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/ || exit 1

# Start server
CMD ["node", "dist/index.js"]