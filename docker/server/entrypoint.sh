#!/bin/bash
echo "tc qdisc add dev eth0 root tbf rate 5454kbit burst 32kbit latency 50ms"
tc qdisc add dev eth0 root tbf rate 1800kbit burst 64kbit latency 1ms

echo "httpd-foreground"
httpd-foreground
