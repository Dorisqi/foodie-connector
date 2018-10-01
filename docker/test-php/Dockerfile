FROM php:7.2-alpine

# Install Redis
RUN apk add --no-cache redis

# Install composer
RUN curl -L https://getcomposer.org/download/1.7.2/composer.phar > /usr/bin/composer && chmod +x /usr/bin/composer
RUN curl -L https://phar.phpunit.de/phpunit-7.phar > /usr/bin/phpunit && chmod +x /usr/bin/phpunit
RUN curl -L https://squizlabs.github.io/PHP_CodeSniffer/phpcs.phar > /usr/bin/phpcs && chmod +x /usr/bin/phpcs
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install Stripe Mock
RUN mkdir /usr/local/stripe-mock && \
    cd /usr/local/stripe-mock && \
    curl -L https://github.com/stripe/stripe-mock/releases/download/v0.33.0/stripe-mock_0.33.0_linux_amd64.tar.gz > stripe-mock.tar.gz && \
    tar -zxf stripe-mock.tar.gz && \
    rm stripe-mock.tar.gz

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
