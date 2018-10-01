#!/bin/sh

set -e

phpcs .
chmod +x generate-api-doc.sh
./generate-api-doc.sh
cd ../
git add backend/api-doc.md
