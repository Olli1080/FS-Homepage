# Stage 1: Build
FROM node:22-bullseye-slim AS builder

# Install system dependencies needed for building native node modules
RUN apt-get update && apt-get -y install --no-install-recommends \
  unzip \
  bzip2 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
# Also copy patches if they exist (used by patch-package)
COPY patches ./patches

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Set build environment
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV NODE_ENV=production

# Run build process (outputs to ./production)
RUN npm run build

# Remove development dependencies to keep the production image small
RUN npm prune --production


# Stage 2: Production Runtime
FROM node:22-bullseye-slim

WORKDIR /app

# Copy production build and dependencies from builder stage
COPY --from=builder --chown=node:node /app/production ./production
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Set runtime environment
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=4096

# The application listens on port 5000
EXPOSE 5000

# Use a non-root user for security
USER node

# Start the application using node directly instead of npm for better signal handling
# The entry point is located in ./production/src/server/entryProduction.js
CMD ["node", "--experimental-specifier-resolution=node", "./production/src/server/entryProduction.js"]
