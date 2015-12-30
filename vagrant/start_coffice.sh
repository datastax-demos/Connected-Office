#!/bin/sh

if [ ! -f "coffice/dse-4.5.1-bin.tar.gz" ]
then
    echo "Copy dse tarball for faster boot times..."
    cp dse-4.5.1-bin.tar.gz coffice/
fi

echo "Installing node and npm..."
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y -qq nodejs git-core

echo "Setup user npm workaround..."
echo prefix = ~/.node >> ~/.npmrc
echo "export PATH=$HOME/.node/bin:\$PATH" >> ~/.profile
. ~/.profile

echo "Install pm2..."
npm install pm2 -g

cd coffice

echo "Installing any additional npm requirements..."
npm install

echo "Setup schema..."
cqlsh -f schema.cql

echo "Setting up localhost Connected Office environmental variables..."
echo "export CASSANDRA_HOST=127.0.0.1" >> ~/.profile
echo "export COFFICE_WEBSERVER=127.0.0.1" >> ~/.profile
. ~/.profile

echo "Starting webserver..."
pm2 start app.js -i 1 --watch -x

echo "Loading fake data..."
(
    cd ~
    coffice/scripts/sensor_data/sensor_load.sh
)

echo "Setting up cron jobs..."
sudo cp cron/crontab.list /etc/cron.d/coffice

# echo "Running first rollups..."
# cron/1.init.sh
