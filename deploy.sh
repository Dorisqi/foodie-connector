#!/bin/sh

set -e

ssh -p 5749 sxn@foodie-connector.centralus.cloudapp.azure.com \
    "sudo docker login --username ${DOCKER_HUB_USERNAME} --password ${DOCKER_HUB_PASSWORD} && \
    sudo docker pull ${IMAGE_NAME}:${IMAGE_TAG} && \
    sudo docker run -d --restart unless-stopped --network=webproxy --name=app-${IMAGE_TAG}-${BITBUCKET_BUILD_NUMBER} -v /docker/app/${IMAGE_TAG}/storage/app:/var/www/storage/app ${IMAGE_NAME}:${IMAGE_TAG} && \
    cd /docker/nginx/sites-available && \
    sudo mv app_upstream app_upstream.old && \
    echo 'proxy_pass http://app-${IMAGE_TAG}-${BITBUCKET_BUILD_NUMBER};' | sudo tee app_upstream"
