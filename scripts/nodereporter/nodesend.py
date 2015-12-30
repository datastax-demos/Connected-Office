#!/usr/bin/env python
import logging
import logging.handlers
import requests
import shlex
import subprocess


url = 'http://146.148.48.230:8983'

command = '/sbin/ifconfig'
# command = 'cat sample_ifconfig.txt'     # FOR REMOTE DEBUGGING PURPOSES


logger = logging.getLogger('nodesend')
logger.setLevel(logging.DEBUG)

def setup_logging():
    fh = logging.handlers.RotatingFileHandler('nodesend.log',
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


def get_ifconfig():
    parsed_command = shlex.split(command)
    logger.info('Running command: %s', command)
    proc = subprocess.Popen(parsed_command, bufsize=1,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT,
                            universal_newlines=True)
    read = proc.communicate()
    logger.info('Result seen:\nstdout:\n%s\nstderr:\n%s\n', str(read[0]), str(read[1]))

    return read[0]

def get_hostname():
    command = 'hostname'
    parsed_command = shlex.split(command)
    logger.info('Running command: %s', command)
    proc = subprocess.Popen(parsed_command, bufsize=1,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT,
                            universal_newlines=True)
    read = proc.communicate()
    logger.info('Result seen:\nstdout:\n%s\nstderr:\n%s\n', str(read[0]), str(read[1]))

    return read[0]

def get_mac_and_ip():
    ifconfig = get_ifconfig()

    mac_address = None
    for line in ifconfig.split('\n'):
        if mac_address:
            ip = line.split()[1].split(':')[1]
            logger.info('Seen (mac, ip): (%s , %s)' % (mac_address, ip))
            return mac_address, ip
        if line and line[0] != '\t' and line[0] != ' ':
            if line[0:3] == 'em1' or line[0:4] == 'eth0':
                mac_address = line.split()[-1]

def main():
    try:
        setup_logging()

        mac_address, ip = get_mac_and_ip()
        hostname = get_hostname().strip()
        requests.get('%s/track/%s/%s' % (url, hostname, ip))
    except:
        logger.exception('Error seen in main():')

if __name__ == "__main__":
    main()
