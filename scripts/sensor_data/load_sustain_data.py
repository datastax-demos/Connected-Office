#!/usr/bin/env python

import requests
import datetime
import time
import random
import traceback

from utils import COFFICE_WEBSERVER, PORT

rooms = ["BirdCage", "BoardRoom", "Grizzly", "Vortex", "DropZone", "FlightDeck", "Yeager"]

while True:
    try:
        for index, name in enumerate(rooms):

            timeNow = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            random.seed(timeNow)
            payload = {'sensor_id' : 'humidity_' + name,
                       'value_ts' : timeNow,
                       'value' : 15 + random.randint(-3, 3) }
            requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                          data=payload)

            payload = {'sensor_id' : 'temp_' + name,
                       'value_ts' : timeNow,
                       'value' : 70 + random.randint(-10, 10) }
            requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                          data=payload)

            payload = {'sensor_id' : 'pressure_' + name,
                       'value_ts' : timeNow,
                       'value' : 145 + random.randint(-2, 2) }
            requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                          data=payload)

            payload = {'sensor_id' : 'lumens_' + name,
                       'value_ts' : timeNow,
                       'value' : 25 + random.randint(-15, 25) }
            requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                          data=payload)

            payload = {'sensor_id' : 'motion_' + name,
                       'value_ts' : timeNow,
                       'value' : 0 + random.randint(0, 1) }
            requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                          data=payload)


            time.sleep(2)
            print("test batch: " + str(timeNow))
    except:
        print traceback.format_exc()
        time.sleep(10)
