#!/bin/bash

set -e

cd /app/backend
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan db:seed --force
php artisan db:seed --force --class=VoyagerDatabaseSeeder
php artisan config:cache
php artisan route:cache
php artisan storage:link

nohup php artisan mock:driver-location &

service php7.2-fpm start
nginx -g 'daemon off;'
