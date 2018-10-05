#!/bin/bash

set -e

cd /app/backend
php artisan migrate
php artisan db:seed
php artisan db:seed --class=VoyagerDatabaseSeeder

service php7.2-fpm start
nginx -g 'daemon off;'
