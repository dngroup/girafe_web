# dockermgt
#
# VERSION       1.0

# ~~~~ Image base ~~~~
FROM java:8
MAINTAINER David Bourasseau <dbourasseau@viotech.net>

EXPOSE 9000

RUN apt-get update && apt-get install -y netcat
# get the lasted version of dockermgt
ADD dockermgt.jar dockermgt.jar
COPY entrypoint.sh /sbin/entrypoint.sh
RUN chmod 755 /sbin/entrypoint.sh


CMD /sbin/entrypoint.sh
