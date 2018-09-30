FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN true

RUN apt-get update

# Install tools
RUN apt-get install -y apt-utils
RUN apt-get install -y curl git gnupg2 

# Install NGINX
RUN apt-get install -y nginx

# Install PHP
RUN apt-get install -y php7.2-fpm

# Install PHP extensions
RUN apt-get install -y php7.2-mbstring php7.2-xml php7.2-json php7.2-zip php7.2-dev php7.2-sybase

# Setup directory for PHP sock
RUN mkdir /run/php && chown www-data /run/php

# Install sqlsrv
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/18.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools && \
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile && \
    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc && \
    apt-get -y install unixodbc-dev && \
    pecl install sqlsrv && \
    pecl install pdo_sqlsrv && \
    echo extension=pdo_sqlsrv.so >> `php --ini | grep "Scan for additional .ini files" | sed -e "s|.*:\s*||"`/30-pdo_sqlsrv.ini && \
    echo extension=sqlsrv.so >> `php --ini | grep "Scan for additional .ini files" | sed -e "s|.*:\s*||"`/20-sqlsrv.ini

# Install composer
RUN curl https://getcomposer.org/installer -o composer-setup.php && \
    php -r "if (hash_file('SHA384', 'composer-setup.php') === '93b54496392c062774670ac18b134c3b3a95e5a5e5c8f1a9f115f203b75bf9a129d5daa8ba6a13e2cc8a1da0806388a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
    php composer-setup.php --install-dir=bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

# Copy NGINX configuration
COPY nginx-site.conf /etc/nginx/sites-enabled/default

# Setup running environment
COPY entrypoint.sh /app/
WORKDIR /app
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT [ "/app/entrypoint.sh" ]
