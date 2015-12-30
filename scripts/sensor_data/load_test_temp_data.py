#!/usr/bin/env python

import requests
import datetime
import time
import random

from utils import COFFICE_WEBSERVER, PORT

while True:
    for i in range (0,5):
        timeNow = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        random.seed(timeNow)
        payload = {'sensor_id' : 'facect_pi' + str(i),
                   'value_ts' : timeNow,
                   'value' : 2 + random.randint(-2, 4) }
        requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                      data=payload)
    
    time.sleep(5)
    print("facecount batch: " + str(timeNow))
