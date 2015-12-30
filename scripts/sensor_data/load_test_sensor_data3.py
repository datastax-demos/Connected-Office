#!/usr/bin/env python

import requests
import datetime
import time
import random

from utils import COFFICE_WEBSERVER, PORT

while True:
    for i in range (1, 10):
        timeNow = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        random.seed(timeNow)
        payload = {'sensor_id' : 'none_00' + str(i),
                   'value_ts' : timeNow,
                   'value' : 70 + random.randint(-2, 2) }
        requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                      data=payload)
    
    time.sleep(.1)
    print("test batch: " + str(timeNow))
