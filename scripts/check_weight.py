#!/usr/bin/env python
import requests
import datetime
import time
import sys
import traceback
from signal import signal, SIGPIPE, SIG_DFL
import subprocess

from requests_futures.sessions import FuturesSession
session = FuturesSession(max_workers=10)

host = "localhost"
scale_almonds = "hidraw3"
scale_granolaBars = "hidraw4"
scale_mints = "hidraw5"
scale_warHeads  = "hidraw6"
scale_pretzels = "hidraw7"
scale_mnms = "hidraw8"
scale_clementines = "hidraw9"

while True:
    try:
        timeNow = datetime.datetime.utcnow()
        weight_almonds = subprocess.Popen(['sudo', './test.pl', scale_almonds], preexec_fn = lambda: signal(SIGPIPE, SIG_DFL), stderr=subprocess.PIPE, stdout=subprocess.PIPE)
        weight_granolaBars = subprocess.Popen(['sudo', './test.pl', scale_granolaBars], preexec_fn = lambda: signal(SIGPIPE, SIG_DFL), stderr=subprocess.PIPE, stdout=subprocess.PIPE)
        weight_mints = subprocess.Popen(['sudo', './test.pl', scale_mints], preexec_fn = lambda: signal(SIGPIPE, SIG_DFL), stderr=subprocess.PIPE, stdout=subprocess.PIPE)
        weight_snickers = subprocess.Popen(['sudo', './test.pl', scale_warHeads], preexec_fn = lambda: signal(SIGPIPE, SIG_DFL), stderr=subprocess.PIPE, stdout=subprocess.PIPE)
        weight_reeses = subprocess.Popen(['sudo', './test.pl', scale_pretzels], preexec_fn = lambda: signal(SIGPIPE, SIG_DFL), stderr=subprocess.PIPE, stdout=subprocess.PIPE)
        weight_andes = subprocess.Popen(['sudo', './test.pl', scale_mnms], preexec_fn = lambda: signal(SIGPIPE, SIG_DFL), stderr=subprocess.PIPE, stdout=subprocess.PIPE)
        weight_starburst = subprocess.Popen(['sudo', './test.pl', scale_clementines], preexec_fn = lambda: signal(SIGPIPE, SIG_DFL), stderr=subprocess.PIPE, stdout=subprocess.PIPE)

        print(timeNow)
        # loop over snacks
        payload1 = {'sensor_id' : 'weight_almonds', 'value_ts' : timeNow, 'value' : weight_almonds.communicate()[0] }
        one = session.post("http://%s:%s/api/sensor" % (host, 3000), data=payload1)
        print(payload1)
        payload2 = {'sensor_id' : 'weight_granolaBars', 'value_ts' : timeNow, 'value' : weight_granolaBars.communicate()[0]  }
        two = session.post("http://%s:%s/api/sensor" % (host, 3000), data=payload2)
        print(payload2)
        payload3 = {'sensor_id' : 'weight_andes', 'value_ts' : timeNow, 'value' : weight_andes.communicate()[0]  }
        three = session.post("http://%s:%s/api/sensor" % (host, 3000), data=payload3)
        print (payload3)
        payload4 = {'sensor_id' : 'weight_reeses', 'value_ts' : timeNow, 'value' : weight_reeses.communicate()[0]  }
        four = session.post("http://%s:%s/api/sensor" % (host, 3000), data=payload4)
        print (payload4)
        payload5 = {'sensor_id' : 'weight_mints', 'value_ts' : timeNow, 'value' : weight_mints.communicate()[0]  }
        five = session.post("http://%s:%s/api/sensor" % (host, 3000), data=payload5)
        print (payload5)
        payload6 = {'sensor_id' : 'weight_snickers', 'value_ts' : timeNow, 'value' : weight_snickers.communicate()[0]  }
        six = session.post("http://%s:%s/api/sensor" % (host, 3000), data=payload6)
        print (payload6)
        payload7 = {'sensor_id' : 'weight_starburst', 'value_ts' : timeNow, 'value' : weight_starburst.communicate()[0]  }
        seven = session.post("http://%s:%s/api/sensor" % (host, 3000),data=payload7)
        print (payload7)

        sys.stdout.flush()
        time.sleep(.1)
    except:
        print traceback.format_exc()
        time.sleep(10)

