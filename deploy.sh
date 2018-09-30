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

BUILD_ID=${BITBUCKET_BRANCH}_${BITBUCKET_COMMIT}_${BITBUCKET_BUILD_NUMBER}
REMOTE_BUILD_ID=$(curl ${[TYPE]_APP_URL}/version)
if [ $BUILD_ID -eq $REMOTE_BUILD_ID ] then
    # Stop and remove old images
    ssh -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} \
        "IMAGES=$(sudo docker ps | grep -E -o 'app-${[TYPE]_IMAGE_TAG}-[0-9]+' | grep -v 'app-${[TYPE]_IMAGE_TAG}-${BITBUCKET_BUILD_NUMBER}') && \
        echo $IMAGES | xargs -n1 sudo docker stop && \
        echo $IMAGES | xargs -n1 sudo docker rm"
else
    ssh -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST} \
        "cd /docker/nginx/sites-available && \
        sudo mv app_upstream.old app_upstream && \
        sudo docker exec web nginx -s reload && \
        sudo docker stop app-${[TYPE]_IMAGE_TAG}-${BITBUKET_BUILD_NUMER} && \
        sudo docker rm app-${[TYPE]_IMAGE_TAG}-${BITBUCKET_BUILD_NUMBER}"
fi
