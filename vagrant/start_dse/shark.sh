#!/bin/sh

echo "Starting DataStax Enterprise (Shark Node)..."
cd dse
bin/dse cassandra -k -pid
