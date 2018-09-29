#!/bin/bash

set -e

cd backend
cp .env.release .env.deploy
echo "APP_KEY=${[TYPE]_APP_KEY}" >> .env.deploy
echo "APP_URL=${[TYPE]_APP_URL}" >> .env.deploy
echo "DB_DATABASE=${[TYPE]_DB_DATABASE}" >> .env.deploy
echo "DB_USERNAME=${[TYPE]_DB_USERNAME}" >> .env.deploy
echo "DB_PASSWORD=${[TYPE]_DB_PASSWORD}" >> .env.deploy
echo "REDIS_HOST=${[TYPE]_REDIS_HOST}" >> .env.deploy
echo "REDIS_PASSWORD=${[TYPE]_REDIS_PASSWORD}" >> .env.deploy
echo "SPARKPOST_SECRET=${[TYPE]_SPARKPOST_SECRET}" >> .env.deploy
cd ../
./docker/docker-login.sh
BUILD_ID=${BITBUCKET_BRANCH}_${BITBUCKET_COMMIT}_${BITBUCKET_BUILD_NUMBER}
ESCAPED_IMAGE_NAME=$(echo ${IMAGE_NAME} | sed -e "s/\//\\\\\//g")
ESCAPED_BUILD_ID=$(echo ${BUILD_ID} | sed -e "s/\//\\\\\//g")
sed -e "s/\[IMAGE_NAME\]/${ESCAPED_IMAGE_NAME}/g" -e "s/\[BUILD_ID\]/${ESCAPED_BUILD_ID}/g" Dockerfile | docker build -t ${IMAGE_NAME}:${[TYPE]_IMAGE_TAG} -f - .
docker push ${IMAGE_NAME}:${[TYPE]_IMAGE_TAG}
