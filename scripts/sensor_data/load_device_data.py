#!/usr/bin/env python

import requests

from utils import COFFICE_WEBSERVER, PORT

payload = {'device_id' : '00:01:12:Ab:CC:09',
           'device_description' : 'Travis iPhone',
           'device_name' : 'travphone',
           'user_id' : 'crazy_uuid2_goes_here' }
requests.post("http://%s:%s/api/whitelist" % (COFFICE_WEBSERVER, PORT),
              data=payload)
print("test batch sent: ")
