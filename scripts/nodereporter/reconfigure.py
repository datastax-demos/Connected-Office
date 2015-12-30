#!/usr/bin/env python
import shlex
import subprocess
import requests

cassandra_yaml_location = '/etc/dse/cassandra/cassandra.yaml'
agent_yaml_location = '/var/lib/datastax-agent/conf/address.yaml'

opscenter_conf_location = '/etc/opscenter/opscenterd.conf'
opscenter_yaml_location = '/etc/opscenter/clusters/DataStax_Enterprise_Cluster.conf'
rest_api_location = '/home/datastax/repos/coffice/routes/restapi.js'
weight_sensor_location = '/home/datastax/repos/coffice/scripts/check_weight.py'

new_york = ['nuc0', 'nuc1', 'nuc2', 'nuc3']
london = ['nuc4', 'nuc5', 'nuc6', 'nuc7']
tokyo = ['nuc8', 'nuc9', 'nuc10', 'nuc11']


seeds = [
    new_york[0], new_york[1],
    london[0], london[1],
    tokyo[0], tokyo[1]
]

all_nodes = new_york + london + tokyo

url = 'http://146.148.48.230:8983/'

def exe(ip, commands):
    long_command = '; '.join(commands)

    exec_command = 'ssh -t datastax@%s "%s"' % (ip, long_command.replace('"', '\\"'))
    print exec_command
    subprocess.call(shlex.split(exec_command))

def generate_hosts_file(seen_nodes):
    with open('nucs.hosts', 'w') as f:
        node = 'datastax-demos-0'
        f.write('%s\t%s\n' % (node, seen_nodes[node]))

        for node in all_nodes:
            f.write('%s\t\t\t%s\n' % (node, seen_nodes[node]))

def main():
    seen_nodes = requests.get(url).json()
    generate_hosts_file(seen_nodes)

    seed_nodes = []
    for seed in seeds:
        if seed in seen_nodes:
            seed_nodes.append(seen_nodes[seed])

    for mac_address in seen_nodes.keys():
        if mac_address in all_nodes:
            ip_address = seen_nodes[mac_address]
            commands = [
                # configure dse settings
                "sudo sed -i 's|^listen_address:.*|listen_address: %s|g' %s" % (ip_address, cassandra_yaml_location),
                "sudo sed -i 's|^rpc_address:.*|rpc_address: %s|g' %s" % (ip_address, cassandra_yaml_location),
                "sudo sed -i 's|- seeds:.*|- seeds: \"%s\"|g' %s" % (','.join(seed_nodes), cassandra_yaml_location),
                'sudo service dse restart',

                # configure datastax-agent settings
                "sudo sed -i 's|^stomp_interface:.*|stomp_interface: %s|g' %s" % (seen_nodes['datastax-demos-0'], agent_yaml_location),
                'sudo service dse restart',
            ]
            exe(ip_address, commands)


    ip_address = seen_nodes['datastax-demos-0']
    commands = [
        # configure opscenter cluster
        "sudo sed -i 's|^interface =.*|interface = %s|g' %s" % (ip_address, opscenter_conf_location),
        "sudo sed -i 's|seed_hosts.*|seed_hosts = %s|g' %s" % (','.join(seed_nodes), opscenter_yaml_location),
        'sudo service opscenterd restart',

        # configure app.js settings
        "sed -i \"s|var hosts =.*|var hosts = ['%s'];|g\" %s" % ("', '".join(seed_nodes), rest_api_location),

        # configure usb weight script
        "sed -i 's|^host =.*|host = \"%s\"|g' %s" % (ip_address, weight_sensor_location),
    ]
    exe(ip_address, commands)

    print '\n\n\n\nRUN THESE COMMANDS MANUALLY ON THE COMMAND NUC:'

    # kick off app
    print "cd ~/repos/coffice; pm2 start app.js -i max --watch; cd"

    # kick off usb weight script
    print "nohup %s &" % weight_sensor_location

    # kick off device finder
    print 'nohup repos/coffice/scripts/devicefinder.py wlan0 %s &' % ip_address

    # kick off new load scripts
    print 'export COFFICE_WEBSERVER=%s; repos/coffice/scripts/sensor_data/sensor_load.sh' % ip_address


if __name__ == "__main__":
    main()
