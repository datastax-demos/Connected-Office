#!/usr/bin/env python
from Queue import Queue

import logging
import logging.handlers
import shlex
import subprocess
import sys
import time
import re
import requests

from collections import defaultdict
from nbstreamreader import NonBlockingStreamReader as NBSR
from threading import Thread


logger = logging.getLogger('devicefinder')
logger.setLevel(logging.DEBUG)

def setup_logging():
    fh = logging.handlers.RotatingFileHandler('devicefinder.log',
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

def setup_globals():
    global rssi_regex, mac_regex, probe_regex, sensor_id, interface, DEBUG, \
        NUM_WORKER_THREADS, q, d, domain

    DEBUG = False
    NUM_WORKER_THREADS = 1
    d = defaultdict(list)

    q = SetQueue()

    # precompile regex
    rssi_regex = re.compile(r'(-\d\d?)dB')
    mac_regex = re.compile(r'\w*:(\w*:\w*:\w*:\w*:\w*:\w*)')
    probe_regex = re.compile(r'Probe Request')

    # grab sensor information
    try:
        sensor_id = open('/sys/class/net/eth0/address').read().strip()
    except:
        sensor_id = 'OSX_SENSOR'
    logger.info('Sensor id: %s', sensor_id)

    # grab interface information
    interface = 'wlan0'
    if len(sys.argv) > 1:
        interface = sys.argv[1]
    logger.info('Using interface: %s', interface)

    # grab domain information
    domain = 'localhost'
    if len(sys.argv) > 2:
        domain = sys.argv[2]
    logger.info('Using domain: %s', domain)

def send_text_message(message):
    payload = {'key': 'send123',
               'message': message}

    failure_phone_numbers = requests.get('http://%s:3000/api/netmon_down' % domain).json()
    for phone_number in failure_phone_numbers:
        payload['number'] = phone_number

        try:
            resp = requests.post('http://%s:3000/api/message' % domain, data=payload)
            logger.debug('Response: %s', resp.text)
        except:
            logger.exception('Issue seen with payload: %s', payload)


class SetQueue(Queue):

    def _init(self, maxsize):
        Queue._init(self, maxsize)
        self.all_items = set()

    def _put(self, item):
        if item not in self.all_items:
            Queue._put(self, item)
            self.all_items.add(item)

    def _get(self):
        item = Queue._get(self)
        self.all_items.remove(item)
        return item


def place_in_queue(mac_address, rssi, rssi_ts):
    logger.debug('Placing in queue: %s, %s, %s', mac_address, rssi, rssi_ts)
    q.put(mac_address)
    d[mac_address].append((rssi, rssi_ts))

def Api_Caller():
    while True:
        mac_address = q.get()

        rssi_tuple = (-100, 0)
        while d[mac_address]:
            this_tuple = d[mac_address].pop()
            if this_tuple[0] > rssi_tuple[0]:
                rssi_tuple = this_tuple

        if rssi_tuple == (-100, 0):
            continue

        payload = {'sensor_id': sensor_id,
                   'device_id': mac_address,
                   'rssi': rssi_tuple[0],
                   'rssi_ts': rssi_tuple[1]}

        try:
            logger.info('Sending payload: %s, Queue size: %s', payload, q.qsize())
            resp = requests.post('http://%s:3000/api/netsensorall' % domain, data=payload)
            logger.debug('Response: %s', resp.text)
        except:
            logger.exception('Issue seen with payload: %s', payload)

        q.task_done()

def Run(command):
    command = shlex.split(command)
    proc = subprocess.Popen(command, bufsize=1,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT,
                            universal_newlines=True)
    return proc

def Trace(proc):
    drop_packets = False
    while proc.poll() is None:
        try:
            line = nbsr.readline(30)
            if line:
                # find current timestamp
                try:
                    rssi_ts = float(line.split()[0])
                except:
                    rssi_ts = time.time()

                # check if currently playing catchup with sensor data
                if drop_packets:
                    if time.time() - rssi_ts < 1:
                        drop_packets = False
                    continue

                # check if sensor data above acceptable latency
                if time.time() - rssi_ts > 10:
                    send_text_message('Purging 10 seconds worth of logs on %s!' % sensor_id)
                    logger.warn('Purging latency at %s!', rssi_ts)
                    drop_packets = True
                    continue

                # check for probe request lines
                probe_search = probe_regex.search(line)

                if probe_search:
                    # check if log has usable data with 'dB' entry
                    rssi_search = rssi_regex.search(line)

                    if rssi_search:
                        rssi = int(rssi_search.group(1))
                        mac_addresses = mac_regex.findall(line)
                        logger.debug('Mac addresses: %s', mac_addresses)

                        for mac_address in mac_addresses:
                            mac_address = mac_address.lower()
                            if not mac_address in (sensor_id, 'ff:ff:ff:ff:ff:ff'):
                                place_in_queue(mac_address, rssi, rssi_ts)
            else:
                logger.warn('Stalled device! Sending netmon_down text...')
                send_text_message('Sensor %s is offline!' % sensor_id)
        except:
            logger.exception('Issue seen in main loop:')

setup_logging()
setup_globals()
command = 'sudo tcpdump -tt -I -e -s 128 -n -i %s type mgt subtype probe-req' % interface
command = 'sudo tcpdump -tt -I -e -s 128 -n -i %s' % interface

for i in range(NUM_WORKER_THREADS):
     t = Thread(target=Api_Caller)
     t.daemon = True
     t.start()

logger.info('Ensuring in monitor mode...')
Run('sudo ifconfig %s down' % interface).communicate()
Run('sudo iwconfig %s mode monitor' % interface).communicate()
Run('sudo ifconfig %s up' % interface).communicate()

logger.info('Running: %s', command)
proc = Run(command)
nbsr = NBSR(proc.stdout)
Trace(proc)
# q.join()
