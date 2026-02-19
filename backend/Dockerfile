FROM node:20-alpine AS build

WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Install build tools for native modules (needed for npm ci --omit=dev if native modules are present)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --omit=dev

# Optional: Remove build tools to keep image small (after npm ci)
# RUN apk del python3 make g++

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]