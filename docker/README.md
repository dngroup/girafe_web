# demo_temu

## Build

launch  from the root package

```
mvn clean package
```




## Deployment
The demo need docker to be installed on the machine with a version higher than 1.7. The java code need to communicate with the docker daemon using TCP.

>By default Docker server is using UNIX sockets for communication with the Docker client, however docker-java client uses TCP/IP to connect to the Docker server by default, so you will need to make sure that your Docker server is listening on TCP port. To allow Docker server to use TCP add the following line to /etc/default/docker
 
> src - [docker-java/docker-java](https://github.com/docker-java/docker-java)

```
DOCKER_OPTS="-H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock"
```

go to docker/compose 

```
docker-compose up
```
