#!/usr/bin/env python

import sys

from scapy.all import sniff, Dot11, Dot11ProbeReq

PROBE_REQUEST_TYPE=0
PROBE_REQUEST_SUBTYPE=4

WHITELIST = ['84:8E:0C:27:9E:EC',] # Replace this with your phone's MAC address


def PacketHandler(pkt):
    if pkt.haslayer(Dot11):
        if pkt.type==PROBE_REQUEST_TYPE and pkt.subtype == PROBE_REQUEST_SUBTYPE and ( pkt.addr2.lower() in WHITELIST or pkt.addr2.upper() in WHITELIST):
            PrintPacket(pkt)

def PrintPacket(pkt):
    try:
        extra = pkt.notdecoded
    except:
        extra = None
    if extra!=None:
        signal_strength = -(256-ord(extra[-4:-3]))
    else:
        signal_strength = -100
        print "No signal strength found"
    print "Target: %s Source: %s SSID: %s RSSi: %d"%(pkt.addr3,pkt.addr2,pkt.getlayer(Dot11ProbeReq).info,signal_strength)
    from datetime import datetime
    thisTime = datetime.utcnow()
    take_readings()
    while 1:
        post_request('sensor_id', pkt.addr2, thisTime, signal_strength, 0)


import requests
from datetime import datetime
import time

def post_request(sensor_id, device_id, rssi_ts, rssi, debug=0):
    thisTime = datetime.utcnow()
    payload = {'sensor_id' : 'netmon', 'device_id' : '84:8E:0C:27:9E:EC', 'rssi_ts' : thisTime, 'rssi' : rssi}

    try:
        resp = requests.post("http://208.96.49.199:3000/api/netsensor",  data=payload)

        if (1==debug):
            print resp.text
    except Exception:
        pass
    print("test batch: " + str(thisTime))

sensor_id= ""


def take_readings():
    global sensor_id


def main():
    print "[%s] Starting scan"%datetime.now()
    print "Scanning for:"
    print "\n".join(mac for mac in WHITELIST)
    sniff(iface=sys.argv[1],prn=PacketHandler)

if __name__=="__main__":
    main()
