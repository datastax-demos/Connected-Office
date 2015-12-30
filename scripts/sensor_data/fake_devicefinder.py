#!/usr/bin/env python
import logging
import logging.handlers
import random
import requests
import time

from utils import COFFICE_WEBSERVER, PORT


logger = logging.getLogger('fake_devicefinder')
logger.setLevel(logging.DEBUG)

def setup_logging():
    fh = logging.handlers.RotatingFileHandler('fake_devicefinder.log',
                                              maxBytes=1000000000,
                                              backupCount=2)
    ch = logging.StreamHandler()
    fh.setLevel(logging.DEBUG)
    ch.setLevel(logging.INFO)

    formatter = logging.Formatter('%(created)f - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)

    logger.addHandler(fh)
    logger.addHandler(ch)

def generate():
    while True:
        for i in xrange(random.randint(0, 10)):
            payload = {'sensor_id': 'c0:3f:d5:66:07:0d',
                       'device_id': 'fake_device_%s' % random.randint(1, 100),
                       'rssi': random.randint(-99, -1),
                       'rssi_ts': time.time()}

            try:
                logger.info('Sending payload: %s', payload)
                resp = requests.post('http://%s:%s/api/netsensorall' % (COFFICE_WEBSERVER, PORT), data=payload)
                logger.debug('Response: %s', resp.text)
            except:
                logger.exception('Issue seen with payload: %s', payload)

        time.sleep(random.randint(0, 3))


if __name__ == '__main__':
    setup_logging()
    generate()
