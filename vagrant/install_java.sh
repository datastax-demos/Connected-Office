#!/bin/sh

echo "Setup Java repository..."
sudo echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections
sudo add-apt-repository -y ppa:webupd8team/java
sudo apt-get update

echo "Install webupd8team Java..."
sudo apt-get install -y -qq oracle-java7-installer oracle-java7-set-default

sudo update-java-alternatives -s java-7-oracle
