#!/bin/sh

echo "Starting DataStax Enterprise (Shark + Search Node)..."
cd dse
bin/dse cassandra -k -s -pid
