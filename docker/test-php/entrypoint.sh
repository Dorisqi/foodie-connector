#!/bin/sh

set -e

/usr/bin/redis-server --daemonize yes
nohup /usr/local/stripe-mock/stripe-mock > /usr/local/stripe-mock/log &
