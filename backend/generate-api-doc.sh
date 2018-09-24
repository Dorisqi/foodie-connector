#!/bin/sh

php artisan migrate:api-doc
php vendor/phpunit/phpunit/phpunit
php artisan api-doc:generate
