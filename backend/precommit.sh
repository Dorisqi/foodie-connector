#!/bin/sh

set -e

phpcs .
./generate-api-doc.sh
cd ../
git add backend/api-doc.md
git add frontend/src/__mocks__/api/mock-data.json
