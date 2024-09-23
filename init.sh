#!/bin/sh

# Update Docker images
docker compose build --pull --no-cache
docker compose up -d

echo 'Project is up at https://localhost/'
