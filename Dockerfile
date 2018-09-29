FROM [IMAGE_NAME]:deploy-base

# Install composer dependencies
COPY backend/composer.json backend/composer.lock /app/backend/
RUN cd /app/backend && composer install --no-dev --no-autoloader --no-scripts

COPY backend /app/backend
RUN cd /app/backend && chmod +x predeploy.sh && ./predeploy.sh

# Set version id
RUN echo "[VERSION_ID]" > /app/backend/public/version
