compose=docker compose -f compose.yaml -f compose.dev.yaml

up:
	$(compose) up -d

migrate:
	$(compose) exec php bin/console doctrine:migrations:migrate -n

migration:
	$(compose) exec php bin/console make:migration
