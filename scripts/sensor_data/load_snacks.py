#!/usr/bin/env python

import requests
import datetime
import time
import sys
import traceback

from utils import COFFICE_WEBSERVER, PORT

LOOP_SLEEP = 3

# To add a new snack, add an element to the snacks array and each dictionaries below
# A sensor will automatically get created and start posting weights every 59 seconds

snacks = ['snickers', 'almonds', 'reeses', 'granolaBars', 'andes', 'mints', 'starburst']

workDays = [0,1,2,3,4]
workStart = 14
workEnd = 24
restockHour = 24
restockMinute = 15
restockDays = [0,2,4]

# This is the best tuning number.  Raising it will slow down consumption of all snacks.
eatThreshold = 100

# rate to increment cycle for each snack - high number means quicker eating
popularity = {
    'snickers' : 6,
    'almonds': 3,
    'reeses': 4,
    'granolaBars': 3,
    'andes': 7,
    'mints': 6,
    'starburst': 5,
}

# The running weight that gets reported each minute
currentWeight = {
    'snickers' : 875,
    'almonds': 750,
    'reeses': 800,
    'granolaBars': 775,
    'andes': 700,
    'mints': 750,
    'starburst': 725,
}

# starting weight for each basket - level it gets restocked to when restock happens
startWeight = {
    'snickers' : 875,
    'almonds': 750,
    'reeses': 800,
    'granolaBars': 775,
    'andes': 700,
    'mints': 750,
    'starburst': 725,
}

# base amount to decrement the snack basket (will include random adder/reducer)
rate = {
    'snickers' : 8,
    'almonds': 5,
    'reeses': 4,
    'granolaBars': 4,
    'andes': 9,
    'mints': 5,
    'starburst': 3,
}

# placeholder for counter that indicates when a withdrawal gets made (at eatThreshold, we eat)
cycle = {
    'snickers' : 0,
    'almonds': 0,
    'reeses': 0,
    'granolaBars': 0,
    'andes': 0,
    'mints': 0,
    'starburst': 0,
}

while True:
        try:
            timeNow = datetime.datetime.utcnow()
            print(timeNow)
                # loop over snacks
                #
            for i, v in enumerate(snacks):
                if timeNow.weekday() in workDays and timeNow.hour <= workEnd and timeNow.hour >= workStart:

                    #increment cycle for this minute for each snack
                    cycle[v] = cycle[v] + rate[v]

                    # if it's time to eat, decrement weight and reset cycle to 0
                    if cycle[v] >= eatThreshold:

                        currentWeight[v] = currentWeight[v] - rate[v]
                        if currentWeight[v] <= 0:
                            currentWeight[v] = 0
                        cycle[v] = 0

                # check if its time to restock or not, if yes, restock all baskets
                if timeNow.weekday in restockDays and timeNow.hour == restockHour and timeNow.minute == restockMinute:
                    for ii, vv in enumerate(snacks):
                        currentWeight[v] = startWeight[v]

                # deliver the current weight for each basket

                payload = {'sensor_id' : 'weight_' + v,
                           'value_ts' : timeNow,
                           'value' : currentWeight[v] }
                requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                              data=payload)
                print(v + " : " + str(cycle[v]) + " : " + str(currentWeight[v]))

            sys.stdout.flush()
            time.sleep(LOOP_SLEEP)
        except:
            print traceback.format_exc()
            time.sleep(LOOP_SLEEP)
