#!/bin/bash

set -e

sed -e "s/\[SERVICE_ENDPOINT\]/${SERVICE_ENDPOINT}/g" nginx/site.conf > nginx/test.conf
kubectl delete configmap nginx-config
kubectl create configmap generic nginx-config --from-file=redirect.conf=nginx/redirect.conf --from-file=ssl=nginx/ssl --from-file=test.conf=nginx/test.conf
kubectl get pods | grep -o "^web-[a-z0-9-]*" | xargs -n1 kubectl delete pod
