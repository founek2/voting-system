compose=docker compose -f compose.yaml -f compose.override.yaml

up:
	$(compose) up -d

upb:
	$(compose) up -d --build

down:
	$(compose) down

migrate:
	$(compose) exec php bin/console doctrine:migrations:migrate -n

migrate-prev:
	$(compose) exec php bin/console doctrine:migrations:migrate -n prev

migration:
	$(compose) exec php bin/console make:migration

jwt:
	$(compose) exec php bin/console lexik:jwt:generate-keypair --skip-if-exists

build:
	$(compose) build
