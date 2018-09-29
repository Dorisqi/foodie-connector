#!/bin/bash

set -e

cd /app/backend
php artisan migrate

service php7.2-fpm start
nginx -g 'daemon off;'
