#!/bin/sh

set -e

docker login --username ${DOCKER_HUB_USERNAME} --password ${DOCKER_HUB_PASSWORD}
