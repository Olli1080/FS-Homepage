# STEP 1: Build Stage
FROM node:20.20.1-bullseye-slim AS build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libvips-dev \
    git \
    python3 \
    && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

# Copy configuration and dependency files
COPY package.json package-lock.json ./
COPY ./patches ./patches 

# Install dependencies including devDependencies for the build
RUN npm ci --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the Strapi project
RUN npm run build

# STEP 2: Production Stage
FROM node:20.20.1-bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

# Copy dependency files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev

# Copy built artifacts from the build stage
# Strapi v5 uses .strapi for build cache and admin client
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/.strapi ./.strapi
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/database ./database
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/package.json ./package.json

# Use non-root user
RUN chown -R node:node /opt/app
USER node

EXPOSE 1337
CMD ["npm", "run", "start"]
