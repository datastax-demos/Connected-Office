### A way to find NUCs in a dynamic environment

http://146.148.48.230:8983/ is the address that shows all of our IP addresses.
NOTE: This is publicly visible.

./nodesend.py is set as a @reboot and minutely cronjob on all 13 nucs in case IPs change.

./nodereporter.py is running on an m1.small in EC2. It is also setup as a @reboot script
so it should survive #rebootageddon.

./reconfigure.py should be run off your laptop. It will ssh into all 12 nucs and reconfigure
dse and the datastax-agent. It will then ssh into the command nuc and reconfigure the application.
It also dumps a nucs.hosts in the current directory, if you want to later use it.
A few commands are mentioned and should be run manually to complete the setup process.

These last commands are printed out to ensure that no duplicate processes are running.
