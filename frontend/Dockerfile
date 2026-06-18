# Build stage
FROM docker.m.daocloud.io/oven/bun:1-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# Runtime stage
FROM docker.m.daocloud.io/oven/bun:1-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copy only the output from the build stage
COPY --from=build /app/.output ./.output

EXPOSE 3000

# Nuxt 3 entry point with bun
CMD ["bun", ".output/server/index.mjs"]