# Build stage
FROM docker.m.daocloud.io/oven/bun:1-alpine AS build

WORKDIR /app

# Install build tools for native modules (like argon2)
RUN apk add --no-cache python3 make g++

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Runtime stage
FROM docker.m.daocloud.io/oven/bun:1-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Bun can often run native modules without extra tools if they were built in the previous stage, 
# but for argon2 it's safer to keep tools or use the ones from build stage if shared.
# Here we just install what's needed for runtime.
RUN apk add --no-cache python3 make g++

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

# Copy build artifacts
COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["bun", "dist/main.js"]