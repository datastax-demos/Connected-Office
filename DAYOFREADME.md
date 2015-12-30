# TODO

* coffice/cron/1.init.sh and coffice/cron/2.run.sh should be run on a Spark machine on the cluster, at least once
after real data is being stored. These scripts give the consumption rate, yet can be manually hacked. Ask Thom Valley
or Brian Hess for the correct coffice table.
* Make routes/restapi.js DCAware. Point it to New York's data center and have the other data centers
as fall back data centers. Ping Thom Valley or Jorge Bay Gondra to make this happen.
* Make nodereporter's scripts use POST, instead of GET requests for security purposes, if time permits.
* Change css for nuts/bolts/etc.
* Change headings for nuts/bolts/etc.
* Change weight of each nut/bolt/etc at the top of routes/restapi.js in var `snack_weights`.
* Place LED strips at the ends of the weight sensor's glass. Use the black gaffers tape to secure the
strips nicely. Ensure arrow line up.

# MOST IMPORTANT TODO

* Make sure unplugging New York won't take a data center down.

# TO BUY AND/OR TAKE

* Thunderbolt to LAN cable to ensure laptop can be on same network.
* Mini-HDMI to HDMI cable for NUCs.  (NOTE: Mini-HDMI is not standard.)
* Mini-DP to DP cable as backup for NUCs.
* Wireless Keyboard with integrated Mouse makes it easy to debug the NUCs at the booth.
* Get an extra long ethernet cable and another switch in case the NUCs are placed away from the USB scales.

# SETUP

* Connect wifi dongle.
* Turn on USB devices in order, left to right, alternating bottom and top rows.
* Ensure USB devices are tared with an empty jar and set to grams.
* Turn on all NUCs.
* Run `scripts/nodereporter/reconfigure.py` on a laptop on the same network.
* Run remaining commands that get printed out on the command nuc.

# Things to know at the show

If all else fails, just run locally without GoGrid.

DSE autostarts on the NUCs as does the nodereporter.

scripts/nodereporter/reconfigure.py should be run on your laptop. It will connect to the cluster.

There are a few components:

    * app.js: run on app NUC: node.js rest API application
    * ajax_content/: run on app NUC: served html pages
    * scripts/devicefinder.py: run on app NUC: catches and saves all mac addresses using the REST API
      into DSE.
    * scripts/check_weight.py: run on app NUC: saves usb sensor data every 1 second into DSE using the
      REST API
    * scripts/sensor_data/sensor_load.sh: run on app NUC: kicks off two sensor nohup scripts to fill graphs
      with fake data
    * scripts/nodereporter/nodesend.py: run on dse NUCs: saves IP data to an external m1.small node
    * scripts/nodereporter/nodereporter.py: run on AWS m1.small: returns all saved IP data

# Gotchas

If your app keeps locking up, kill pm2 and start it again.

pm2 reload and --watch doesn't always work, so hard kill it.

`pm2 status` will tell you the restart count. If it's high, you have a log that's in
the coffice directory. Kill the process and start it one level ABOVE the coffice directory.

A single NUC acting funny can screw up all of your routing. You may need to unplug
all nodes in order to find the culprit.

Nuc 4 and 11 were acting funny.

If a Nuc acts funny there, plugin the monitor to see what's wrong. Could be a BIOS
issue.

Weight sensors must be started in order (left to right), switched to grams, and tarred against an empty jar.

JJJJJJJOOOOOOOOOOOOEEEEEEEEELLLLLLLLL: You may have to take the other jar from the side of Maria's
desk if you use all the bowls. If not, return one of them since I had already borrowed one since one broke
during tranport. The extra jar may be used to replace a chipped jar and to tare the sensors if one gets
knocked offline.

Overheating NUCS can be an issue. Try to keep the app NUC outside of the bottom shelve and ontop of the
booth.

If network is flaky, kill the `devicefinder.py` on the command NUC and disable front end jquery calls
in proximity_sensor.js. You'll also want to change the graph's css to take up
all 12 columns, instead of 6, and comment out the proximity sensor in `replenish.html`.
This will help lessen the networking load.

    # the line you want to kill
    setInterval(function() { radar() }, 5000);

