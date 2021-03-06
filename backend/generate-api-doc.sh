#!/bin/sh

set -e

rm -f api-doc.sqlite
export SQLITE_DATABASE=$PWD/api-doc.sqlite
php artisan migrate:api-doc
export GENERATE_API_DOC="true"
php vendor/phpunit/phpunit/phpunit --stop-on-error --stop-on-failure
php artisan api-doc:generate
rm -f api-doc.sqlite
