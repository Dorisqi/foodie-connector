#!/bin/sh

set -e

composer install --optimize-autoloader --no-dev
php artisan storage:link
php artisan optimize --env=deploy
