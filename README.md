# Connected Office Demo

## Installation

* Install [Node.js](http://nodejs.org/).
    * OSX: install [Homebrew](http://brew.sh/), then use brew to install Node.js:
    `brew install node`.
    * Ubuntu: `sudo apt-get install -y nodejs npm`. **NOT** the `node` package.
* While in the root directory of this project, run: `npm install`.

## Setting Up Local Copy of Schema

    ssh root@208.96.49.201 "echo 'DESCRIBE KEYSPACE coffice;' | cqlsh 10.106.69.8" > schema.cql

    #Note: use `gsed` with homebrew in OSX, sed in Linux
    gsed -i "s|'class': 'NetworkTopologyStrategy'|'class': 'SimpleStrategy'|g" schema.cql
    gsed -i "s|'Analytics': '3'|'replication_factor': '1'|g" schema.cql

    cqlsh -f schema.cql

## Running Demo

### Local Vagrant (Preferred)

Install Vagrant: https://www.vagrantup.com/downloads.html

    cd coffice
    vagrant up

    # if you want to get onto the machine
    vagrant ssh

    # to kill your VM
    vagrant destroy

The demo will be available for access at [http://localhost:3000](http://localhost:3000).

Inside your VM will be:

    ~/coffice -> synced directory of what's on your local system. All changes made
    here will be two way changes.

    ~/dse -> an extracted tarball that's running your Shark+Solr setup.

    ~/dse/id -> pid for your dse process.

You can adjust your VM's memory (4GB, by default) and CPU (2, by default) allocation
in coffice/Vagrantfile.

### Local (Manually)

Start the web server at [http://localhost:3000](http://localhost:3000) by running:

    # when running locally, export the CASSANDRA_HOST variable
    export CASSANDRA_HOST=127.0.0.1

    # start node
    node app.js                         # does not output great logs, no restart
    pm2 start app.js -i max --watch     # restarts on file changes
                                        # ensure NO LOGS are being outputted within `coffice`

    # to import fake data
    coffice/scripts/sensor_data/sensor_load.sh

    # grab mac addresses in the area
    coffice/scripts/devicefinder.py <wlan0> <application_url>

    # to import fake data (from outside of coffice, as you'll notice)
    coffice/scripts/sensor_data/sensor_load.sh

    # on first launch
    coffice/cron/1.init.sh

    # every 10 minutes, or so
    coffice/cron/2.run.sh

### Running in Production

    ssh root@208.96.49.199
    cd ~/coffice

    # update the source
    git pull

Sometimes issues happen. In these cases run:

    cd ~/coffice
    pm2 kill                    # ensure the process actually dies, sometimes it doesn't
    pm2 start app.js -i max --watch

Occasionally with new code, you may need to kick pm2 slightly:

    pm2 reload app              # sometimes this doesn't work either, do a hard kill

When debugging comes into play:

    pm2 logs                    # shows logs of all threads

And if you need more logs, use:

    app.use(logger('default'));

## Important files

    routes/restapi.js

Where all routes are defined. POST routes write data to Cassandra. GET routes return
JSON, or other data format. Not all routes in use, so double check to make sure you're
using the intended route.

    public/index.html

It acts as a wrapper and provides the top header, left navigation, updating section
at top of the well and the footer.

    public/ajax_content

The rest of the pages are loaded via AJAX. The HTML content is in the above folder.

    public/js:
        sample3.js
        button_manager.js

        light.js
        humidity.js
        replenishment.js
        temperature.js
        humidity.js
        global.js
        motion.js

The most important javascript files are the first two, along with the trailing list.
The first two may already be split into the trailing files by the time you read this.

button_manager.js is mainly for managing mouse overs on the index page.

    public/css/dashboard.css

This file has all the css overrides and special styles.

**NOTE:** If given the choice between `replenishment` and `replenish`, choose the
replenish file since this is the newest version.

    scripts/sensor_data

Scripts that generate sample data using the Rest API and `$COFFICE_WEBSERVER` and
`$PORT`, if in a development environment.

Be aware that these scripts produce logs in the `cwd`. Due to the nature of `pm2`
you must kick these scripts off one level above the `coffice` directory.

Note: `pip install requests` needs to be run before running the sample scripts.
