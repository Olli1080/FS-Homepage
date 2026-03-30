# STEP 1: Build Stage
FROM node:20.20.1-bullseye-slim AS build

# Install build dependencies for sharp and other native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libvips-dev \
    git \
    python3 \
    && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
COPY ./patches ./patches 

RUN npm ci --legacy-peer-deps

WORKDIR /opt/app
COPY . .
RUN npm run build

# STEP 2: Production Stage
FROM node:20.20.1-bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev

WORKDIR /opt/app
# Copy built artifacts and necessary runtime files
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/build ./build
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/database ./database
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/package.json ./package.json

# Use non-root user
RUN chown -R node:node /opt/app /opt/node_modules
USER node

EXPOSE 1337
CMD ["npm", "run", "start"]
