#!/usr/bin/env python

import requests
import datetime
import time
import sys
import traceback

from utils import COFFICE_WEBSERVER, PORT

# To add a new snack, add an element to the snacks array and each dictionaries below
# A sensor will automatically get created and start posting weights every 59 seconds

snacks = ['cookies', 'granolaBars', 'chips', 'almonds']

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
    'cookies' : 6,
    'granolaBars': 3,
    'chips': 4,
    'almonds': 3
}

# The running weight that gets reported each minute
currentWeight = {
    'cookies' : 875,
    'granolaBars': 750,
    'chips': 800,
    'almonds': 775
}

# starting weight for each basket - level it gets restocked to when restock happens
startWeight = {
    'cookies' : 875,
    'granolaBars': 750,
    'chips': 800,
    'almonds': 775
}

# base amount to decrement the snack basket (will include random adder/reducer)
rate = {
    'cookies' : 8,
    'granolaBars': 5,
    'chips': 4,
    'almonds': 4
}

# placeholder for counter that indicates when a withdrawal gets made (at eatThreshold, we eat)
cycle = {
    'cookies' : 0,
    'granolaBars': 0,
    'chips': 0,
    'almonds': 0
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
            time.sleep(10)
        except:
            print traceback.format_exc()
            time.sleep(10)
