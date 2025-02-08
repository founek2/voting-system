#!/bin/bash
set -e

# Run migrations
bin/console doctrine:migrations:migrate -n

# Start caddy server
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile