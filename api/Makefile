migration:
	docker compose exec php bin/console make:migration

up:
	docker compose up

upd:
	docker compose up -d

down:
	docker compose down

sh:
	docker compose exec php /bin/bash

composer-install:
	docker compose exec php composer install

composer-update:
	docker compose exec php composer update

migrate:
	docker compose exec php bin/console doctrine:migrations:migrate -n

migrate-prev:
	docker compose exec php bin/console doctrine:migrations:migrate prev

migrate-list:
	docker compose exec php bin/console doctrine:migrations:list

test-migrate:
	docker compose exec php sh -c 'bin/console --env=test doctrine:migrations:migrate -n'

test-schema-setup:
	docker compose exec php sh -c 'bin/console doctrine:database:create --if-not-exists --env=test' && \
	docker compose exec php sh -c 'bin/console --env=test doctrine:migrations:migrate'

db-reset:
	docker compose exec php sh -c 'bin/console doctrine:schema:drop --full-database --force'
	docker compose exec php bin/console doctrine:migrations:migrate -n