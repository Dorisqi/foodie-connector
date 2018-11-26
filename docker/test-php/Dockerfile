FROM php:7.2-alpine

# Install PHP GD
RUN apk add --no-cache libpng libpng-dev && docker-php-ext-install gd && apk del libpng-dev

# Install composer
RUN curl -L https://getcomposer.org/download/1.7.2/composer.phar > /usr/bin/composer && chmod +x /usr/bin/composer
RUN curl -L https://phar.phpunit.de/phpunit-7.phar > /usr/bin/phpunit && chmod +x /usr/bin/phpunit
RUN curl -L https://squizlabs.github.io/PHP_CodeSniffer/phpcs.phar > /usr/bin/phpcs && chmod +x /usr/bin/phpcs
ENV COMPOSER_ALLOW_SUPERUSER=1
