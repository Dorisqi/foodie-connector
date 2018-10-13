FROM gcr.io/foodie-connector-1538617250499/deploy-base

# Install composer dependencies
COPY backend/composer.json backend/composer.lock /app/backend/
RUN cd /app/backend && composer install --no-dev --no-autoloader --no-scripts

COPY backend /app/backend
RUN cp /app/backend/.env.release /app/backend/.env
RUN cd /app/backend && ./predeploy.sh

ARG COMMIT_SHA

# Set version id
RUN echo "${COMMIT_SHA}" > /app/backend/public/version
