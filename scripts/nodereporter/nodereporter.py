#!/usr/bin/env python

import json
import shelve

import filelock

from flask import Flask

app = Flask(__name__)

app.secret_key='A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
db_file = 'nodes.shelve'


@app.route('/')
def index():
    app.logger.debug("visiting index")

    with filelock.FileLock(db_file, timeout=10) as lock:
        data = shelve.open(db_file, writeback=True)
        try:
            data_dict = dict(data)
            return json.dumps(data_dict)
        finally:
            data.close()

@app.route('/track/<mac_address>/<ip>')
def track(mac_address=None, ip=None):
    with filelock.FileLock(db_file, timeout=10) as lock:
        data = shelve.open(db_file, writeback=True)
        try:
            key = str(mac_address)
            data[key] = str(ip)
            data.sync()
        finally:
            data.close()

    return json.dumps({
        'mac_address': mac_address,
        'ip': ip
    })

if __name__ == "__main__":
    # Allow access from all hosts, to facilitate running on external servers
    # Allow for a threaded run for multiple requests
    # Display errors with formatted stacktraces on the front-end
    app.run(host='0.0.0.0', port=8983, threaded=True, debug=True)
