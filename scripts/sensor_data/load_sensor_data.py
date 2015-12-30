#!/usr/bin/env python

import requests
import datetime

from utils import COFFICE_WEBSERVER, PORT

while True:
    timeNow = datetime.datetime.now()

    var = "/some/file/path/"
    pipe = subprocess.Popen(["perl", "uireplace.pl", var])


    weight =
    payload = {'sensor_id' : 'temp_' + str(i),
               'value_ts' : timeNow,
               'value' : i }
    print payload
    requests.post("http://%s:%s/api/sensor" % (COFFICE_WEBSERVER, PORT),
                  data=payload)
