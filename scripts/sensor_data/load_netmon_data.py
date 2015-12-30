#!/usr/bin/env python

import requests
import datetime
import random
import time

from utils import COFFICE_WEBSERVER, PORT

while 1:
    for i in range (1, 10):
        thisT = datetime.datetime.utcnow()
        thisTime = (thisT-datetime.datetime(1970,1,1)).total_seconds()
        random.seed(thisTime)
        payload = {'sensor_id' : 'netmon1_' + str(i),
                   'device_id' : 'f0:d1:a9:c1:04:88',
                   'rssi_ts' : thisTime,
                   'rssi' : 50 + random.randint(-2, 2) }
        requests.post("http://%s:%s/api/netsensorall" % (COFFICE_WEBSERVER, PORT),
                      data=payload)
        time.sleep(2)
    print("test batch: " + str(thisTime))
