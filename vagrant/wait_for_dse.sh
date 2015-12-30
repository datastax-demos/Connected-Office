#!/bin/sh

echo "Wait for DataStax Enterprise to start..."
export PATH=/home/vagrant/dse/bin:$PATH

OUTPUT=0;
while [ "$OUTPUT" = 0 ]; do
  OUTPUT=`nodetool status  2> /dev/null | grep -c "UN"`;
done

sleep 5s
