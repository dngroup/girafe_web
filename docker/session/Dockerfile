# Media@home box application Docker image
#
# VERSION       1.0

# ~~~~ Image base ~~~~
FROM java:8
MAINTAINER David Bourasseau <dbourasseau@viotech.net>

EXPOSE 9000

#RUN apt-get update && apt-get install -y netcat
# get the lasted version of dvd2c-box
ADD session.jar session.jar
#COPY entrypoint.sh /sbin/entrypoint.sh
#RUN chmod 755 /sbin/entrypoint.sh


CMD java -jar session.jar 
