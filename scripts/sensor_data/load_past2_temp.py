#!/usr/bin/env python

import requests
import datetime
import time
import random

from utils import COFFICE_WEBSERVER, PORT

thisTime = datetime.datetime.utcnow() - datetime.timedelta(days=2)
timeNow = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

while thisTime < timeNow:  
    for i in range (1, 10):
        random.seed(thisTime)
        payload = {'sensor_id' : 'newtest_00' + str(i),
                   'value_ts' : thisTime,
                   'value' : 70 + random.randint(-2, 2) }
        requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                      data=payload)
    print("test batch: " + str(thisTime))
    thisTime = thisTime + datetime.timedelta(seconds=10) 
