FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN true

# Install tools
RUN apt-get install -y curl git gnupg2 

# Install NGINX
RUN apt-get install -y nginx

# Install PHP
RUN apt-get install -y php7.2-fpm

# Install PHP extensions
RUN apt-get install -y php7.2-mbstring php7.2-xml php7.2-json php7.2-zip php7.2-dev php7.2-mysql php7.2-curl php7.2-gd

# Setup directory for PHP sock
RUN mkdir /run/php && chown www-data /run/php

# Install composer
RUN curl https://getcomposer.org/installer -o composer-setup.php && \
    php -r "if (hash_file('SHA384', 'composer-setup.php') === '93b54496392c062774670ac18b134c3b3a95e5a5e5c8f1a9f115f203b75bf9a129d5daa8ba6a13e2cc8a1da0806388a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
    php composer-setup.php --install-dir=bin --filename=composer && \
    php -r "unlink('composer-setup.php');"
ENV COMPOSER_ALLOW_SUPERUSER=1

# Copy NGINX configuration
COPY nginx-site.conf /etc/nginx/sites-enabled/default

# Setup running environment
COPY entrypoint.sh /app/
WORKDIR /app
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT [ "/app/entrypoint.sh" ]

# Install composer dependencies
COPY backend/composer.json backend/composer.lock /app/backend/
RUN cd /app/backend && composer install --no-dev --no-autoloader --no-scripts

# Deploy backend
COPY backend /app/backend
RUN cp /app/backend/.env.release /app/backend/.env
RUN cd /app/backend && ./predeploy.sh

# Set version id
RUN echo "commit: ${COMMIT_SHA}\nbuild: ${BUILD_ID}\nbuild time: $(env TZ=UTC date)" > /app/backend/public/version

# Deploy frontend
COPY frontend/build /app/frontend/build
