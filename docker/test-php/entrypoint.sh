#!/bin/sh

set -e

/usr/bin/redis-server --daemonize yes
nohup localstripe & > /var/log/localstripe &
