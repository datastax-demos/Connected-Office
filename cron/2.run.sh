#!/bin/sh

DIR="`dirname $0`"
cd $DIR

set -x

./10minutely.sh
./hourly.sh
./daily.sh
./consumption1day.sh
./consumption7day.sh
