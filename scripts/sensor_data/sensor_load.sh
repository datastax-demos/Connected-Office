#!/bin/bash

PAST_DIR="`pwd`"
DIR="`dirname $0`"
cd $DIR

#nohup python load_snacks.py &> $PAST_DIR/snacks_load.out &
#nohup python load_sustain_data.py &> $PAST_DIR/sustainability_load.out &

nohup python load_snacks.py &> $PAST_DIR/load_snacks.out &
nohup python load_smart_data.py &> $PAST_DIR/load_smart_data.out &


