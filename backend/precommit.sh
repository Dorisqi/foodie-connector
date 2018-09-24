#!/bin/sh

phpcs .
php vendor/phpunit/phpunit/phpunit
