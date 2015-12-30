#!/usr/bin/env python

import requests

from utils import COFFICE_WEBSERVER, PORT

payload = {'user_id' : '00:01:12:Ab:CC:09',
           'user_bio' : 'A long sordid tale',
           'user_name' : 'Travis Price',
           'user_other' : 'other_stuff here',
           'user_skills' : 'crazy_uuid2_goes_here' }
requests.post("http://%s:%s/api/userinfo" % (COFFICE_WEBSERVER, PORT),
              data=payload)
print("test batch sent: ")
