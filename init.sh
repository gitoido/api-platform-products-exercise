#!/bin/sh

# Update Docker images
docker compose build --pull --no-cache
docker compose up -d
docker compose exec php bin/console hautelook:fixtures:load -n

echo 'Project is up at https://localhost/'
