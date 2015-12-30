#!/bin/sh

DIR="`dirname $0`"
cd $DIR

set -x

./init_10minutely.sh
./init_10minutely_all.sh
./init_daily.sh
./init_daily_all.sh
./init_hourly.sh
./init_hourly_all.sh
