# Download dependencies (acts as cache)
FROM docker.io/node:22-alpine AS dependencies
RUN corepack enable
WORKDIR /app

COPY package.json yarn.lock  ./
RUN yarn --immutable

# Build frontend files
FROM docker.io/node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=dependencies /app/.pnp.cjs /app/.pnp.loader.mjs /app/.yarn ./
COPY --from=dependencies /root/.yarn /root/.yarn

COPY . .

RUN corepack up && yarn build

# Serve files via Caddy
FROM docker.io/caddy:2.9.1-alpine AS prod
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/build /usr/share/caddy