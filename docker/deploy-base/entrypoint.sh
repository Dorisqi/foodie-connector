#!/bin/bash

set -e

cd /app/backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan storage --link
php artisan migrate
php artisan db:seed
php artisan db:seed --class=VoyagerDatabaseSeeder

service php7.2-fpm start
nginx -g 'daemon off;'
