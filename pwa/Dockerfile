# Download dependencies (acts as cache)
FROM node:20-alpine AS dependencies
RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock  ./
RUN yarn --immutable

# Build frontend files
FROM node:22-alpine3.20 as builder
WORKDIR /app
RUN corepack enable
COPY --from=dependencies /app/.pnp.cjs ./
COPY --from=dependencies /app/.pnp.loader.mjs ./
COPY --from=dependencies /app/.yarn ./.yarn
COPY --from=dependencies /app/.yarn ./.yarn
COPY --from=dependencies /root/.yarn /root/.yarn

COPY . .

RUN corepack up && yarn build

# Serve files via Caddy
FROM caddy:2.9.1-alpine
COPY --from=builder /app/build /usr/share/caddy