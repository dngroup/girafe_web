# dockermgt
#
# VERSION       1.0
FROM java:8
MAINTAINER David Bourasseau <dbourasseau@viotech.net>
EXPOSE 9000
ADD dockermgt.jar dockermgt.jar

CMD java -jar dockermgt.jar -d 172.17.0.1:2375 -f /tmp/datatemu/

