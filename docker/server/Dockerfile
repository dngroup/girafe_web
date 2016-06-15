# Dash serveur dash
#
# VERSION       1.0

# ~~~~ Image base ~~~~
FROM httpd:2.4
MAINTAINER ,David Bourasseau <dbourasseau@viotech.net>


COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
# RUN tc qdisc add dev eth0 root tbf rate 5454kbit burst 32kbit latency 50ms


COPY entrypoint.sh /sbin/entrypoint.sh
RUN chmod 755 /sbin/entrypoint.sh


ENTRYPOINT ["/sbin/entrypoint.sh"]
