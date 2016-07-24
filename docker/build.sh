#!/bin/bash 
cd ..
mvn clean package
cd docker/dockermgt
docker build -t dngroup/simu-dockermgt .
#docker push dngroup/simu-dockermgt
cd ../session
docker build -t dngroup/simu-sessionmgt .
#docker push dngroup/simu-dockermgt 
docker pull dngroup/simuservice
