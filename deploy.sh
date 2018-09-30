#!/bin/sh

set -e

ssh -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} \
    "sudo docker login --username ${DOCKER_HUB_USERNAME} --password ${DOCKER_HUB_PASSWORD} && \
    sudo docker pull ${IMAGE_NAME}:${[TYPE]_IMAGE_TAG} && \
    sudo docker run -d --restart unless-stopped --network=webproxy --name=app-${[TYPE]_IMAGE_TAG}-${BITBUCKET_BUILD_NUMBER} -v /docker/app/${[TYPE]_IMAGE_TAG}/storage/app:/var/www/storage/app ${IMAGE_NAME}:${[TYPE]_IMAGE_TAG} && \
    cd /docker/nginx/sites-available && \
    sudo mv app_upstream app_upstream.old && \
    sleep 10 && \
    echo 'proxy_pass http://app-${[TYPE]_IMAGE_TAG}-${BITBUCKET_BUILD_NUMBER};' | sudo tee app_upstream && \
    sudo docker exec web nginx -s reload"
