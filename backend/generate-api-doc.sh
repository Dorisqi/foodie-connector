#!/bin/sh

rm -f api-doc.sqlite
echo "" > api-doc.sqlite
php artisan migrate:api-doc
export GENERATE_API_DOC="true"
php vendor/phpunit/phpunit/phpunit
php artisan api-doc:generate
rm -f api-doc.sqlite
