#!/usr/bin/env python

from collections import defaultdict

import datetime
import logging
import logging.handlers
import random
import requests
import time

from utils import COFFICE_WEBSERVER, PORT

rooms = ['BirdCage', 'BoardRoom', 'Grizzly', 'Vortex', 'DropZone', 'FlightDeck', 'Yeager']
sensors = ['temperature', 'pressure', 'humidity', 'light', 'motion']
previous_values = defaultdict(dict)
previous_streak = defaultdict(dict)

SUNRISE = 6
SUNSET = 12 + 8
HOURS_OF_HISTORY = 24 * 5
HISTORICAL_SPACING = 60 * 5
REALTIME_SPACING = HISTORICAL_SPACING

logger = logging.getLogger('smartdata')
logger.setLevel(logging.DEBUG)

def setup_logging():
    fh = logging.handlers.RotatingFileHandler('smartdata.log',
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

def time_now():
    return datetime.datetime.utcnow() + datetime.timedelta(hours=-7)

def prime_data(start_hour):
    for room in rooms:
        for sensor in sensors:
            if sensor == 'temperature':
                previous_values[room][sensor] = 70 + random.randint(-5, 5)
            elif sensor == 'pressure':
                previous_values[room][sensor] = 145
            elif sensor == 'humidity':
                previous_values[room][sensor] = 70
            elif sensor == 'light':
                if start_hour > SUNRISE and start_hour < SUNSET:
                    previous_values[room][sensor] = 98
                else:
                    previous_values[room][sensor] = 0
            elif sensor == 'motion':
                if start_hour > SUNRISE and start_hour < SUNSET:
                    previous_values[room][sensor] = 1
                else:
                    previous_values[room][sensor] = 0

            previous_streak[room][sensor] = 0

def update_sensor(payload):
    logger.debug('Sending payload: %s', payload)
    while True:
        try:
            requests.post('http://%s:%s/api/sensor' % (COFFICE_WEBSERVER, PORT),
                          data=payload)
            break
        except:
            logger.warn('Failed sensor update: %s', payload)
            time.sleep(5)

def generate_new_values(room, sensor, min_value, max_value, change_weight):
    # grab last value
    if sensor in ('pressure', 'humidity'):
        # pressure and humidity will be the same throughout the office
        new_value = previous_values['BirdCage'][sensor]
    else:
        new_value = previous_values[room][sensor]

    # grab streak and influence possibility of change
    streak = previous_streak[room][sensor]
    new_value = new_value + random.randint(int(streak * -1 * change_weight), int(streak * change_weight))

    # cap values to a set range
    if new_value > max_value:
        new_value = max_value
    elif new_value < min_value:
        new_value = min_value

    # if change has occurred...
    if new_value != previous_values[room][sensor]:
        # end streak
        previous_streak[room][sensor] = 0

        # REMOVE: debug info
        if room == 'FlightDeck' and sensor == 'temperature':
            logger.info('Updated temperature from %s to %s',
                        previous_values[room][sensor],
                        new_value)
    else:
        # continue streak
        previous_streak[room][sensor] = streak + 1

    # update value memory
    previous_values[room][sensor] = new_value

def generate_temperature(room, timestamp):
    sensor = 'temperature'
    generate_new_values(room, sensor, 64, 76, 0.1)
    
    payload = {'sensor_id' : 'temp_' + room,
               'value_ts' : timestamp,
               'value' : previous_values[room][sensor] }
    update_sensor(payload)

def generate_pressure(room, timestamp):
    sensor = 'pressure'
    generate_new_values(room, sensor, 140, 144, 0.1)

    payload = {'sensor_id' : 'pressure_' + room,
               'value_ts' : timestamp,
               'value' : previous_values[room][sensor] }
    update_sensor(payload)

def generate_humidity(room, timestamp):
    sensor = 'humidity'
    generate_new_values(room, sensor, 15, 100, 0.1)

    payload = {'sensor_id' : 'humidity_' + room,
               'value_ts' : timestamp,
               'value' : previous_values[room][sensor] }
    update_sensor(payload)

def generate_light(room, timestamp):
    sensor = 'light'

    if timestamp.hour > SUNRISE and timestamp.hour < SUNSET:
        generate_new_values(room, sensor, 0, 100, 40)
    else:
        generate_new_values(room, sensor, 0, 10, 0.1)

    payload = {'sensor_id' : 'lumens_' + room,
               'value_ts' : timestamp,
               'value' : previous_values[room][sensor] }
    update_sensor(payload)

def generate_motion(room, timestamp):
    sensor = 'motion'

    if timestamp.hour > SUNRISE and timestamp.hour < SUNSET:
        generate_new_values(room, sensor, 0, 1, 0.4)
    else:
        generate_new_values(room, sensor, 0, 0, 0.6)

    payload = {'sensor_id' : 'motion_' + room,
               'value_ts' : timestamp,
               'value' : previous_values[room][sensor] }
    update_sensor(payload)


def main():
    setup_logging()
    logger.info('Using webserver: %s:%s', COFFICE_WEBSERVER, PORT)

    # set start_time to preload data
    time_loop = time_now() + datetime.timedelta(hours=-1 * HOURS_OF_HISTORY)

    logger.info('Priming data...')
    prime_data(time_loop.hour)

    logger.info('Populating past data...')
    while time_loop < time_now():
        for room in rooms:
            generate_temperature(room, time_loop)
            generate_pressure(room, time_loop)
            generate_humidity(room, time_loop)
            generate_light(room, time_loop)
            generate_motion(room, time_loop)

        time_loop = time_loop + datetime.timedelta(seconds=HISTORICAL_SPACING)

    logger.info('Continuing with current data...')
    while True:
        try:
            this_time = time_now()
            for room in rooms:
                generate_temperature(room, this_time)
                generate_pressure(room, this_time)
                generate_humidity(room, this_time)
                generate_light(room, this_time)
                generate_motion(room, this_time)

            time.sleep(REALTIME_SPACING)
        except KeyboardInterrupt:
            break
        except:
            logger.exception('Exception seen in perpetual data generator:')


if __name__ == '__main__':
    main()
