#!/bin/sh

set -e

phpcs .
chmod +x generate-api-doc.sh
./generate-api-doc.sh
git add api-doc.md
