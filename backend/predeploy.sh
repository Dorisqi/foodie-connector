#!/bin/sh

set -e

chmod -R www-data storage
composer install --optimize-autoloader --no-dev
php artisan storage:link
php artisan optimize --env=deploy
