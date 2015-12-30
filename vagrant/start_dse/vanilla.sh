#!/bin/sh

echo "Starting DataStax Enterprise (Real-Time Node)..."
cd dse
bin/dse cassandra -pid
