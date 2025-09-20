#!/usr/bin/env sh

echo "Starting consumer"
# Some services (like Doctrine's EntityManager) will consume more memory over time.
php /app/bin/console messenger:consume --limit=30 --time-limit=3600 -v async_emails 2>&1;
echo "Consumer died $?"