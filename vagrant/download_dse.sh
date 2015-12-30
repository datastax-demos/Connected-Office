#!/bin/sh

if [ ! -f "dse-4.5.1-bin.tar.gz" ]
then
    echo "Downloading DataStax Enterprise..."
    wget --quiet http://joaquin+2_datastax.com:ZajOfJFnhXmz73x@downloads.datastax.com/enterprise/dse-4.5.1-bin.tar.gz
fi

if [ ! -d "dse-4.5.1" ]; then
    echo "Extracting DataStax Enterprise..."
    tar xf dse-4.5.1-bin.tar.gz
    ln -s dse-4.5.1/ dse
fi

echo "Set up \$PATH to include dse/bin..."
echo "export PATH=/home/vagrant/dse/bin:\$PATH" >> ~/.profile

echo "Creating and modifying permissions for directories..."
sudo mkdir -p /var/lib/cassandra
sudo mkdir -p /var/log/cassandra
sudo chown -R vagrant:vagrant /var/lib/cassandra
sudo chown -R vagrant:vagrant /var/log/cassandra
