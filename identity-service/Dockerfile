# Build stage
FROM node:24.15.0-alpine AS builder

WORKDIR /app

# Copy package files from identity-service directory
COPY identity-service/package.json identity-service/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY identity-service/ .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:24.15.0-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built assets and node_modules from builder
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