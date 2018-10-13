FROM gcr.io/foodie-connector-1538617250499/deploy-base

# Install composer dependencies
COPY backend/composer.json backend/composer.lock /app/backend/
RUN cd /app/backend && composer install --no-dev --no-autoloader --no-scripts

COPY backend /app/backend

RUN cd /app/backend && ./predeploy.sh

# Set version id
RUN echo "${BUILD_ID}" > /app/backend/public/version
