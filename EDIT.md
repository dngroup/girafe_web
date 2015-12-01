#How to edit a file


##Summary



 - [Resume](#resume)
 - [Get all demo](#first-get-all-demo)
 - [website](#website)
 - [How connect to blue](#blue)
 - [How to edit text of the demo](#how-to-edit-text-of-the-demo)
 - [How to add or change demo](#how-to-add-or-change-demo)
 - [How to push modification on server](#how-to-push-modification-on-server)
 - [Commit-push](#commit-push)
 - [Push docker](#push-docker)
 - [Pull docker](#pull-docker)


##Resume

You have 4 folder

 - docker: we have composer and all docker image configuration
 - mddash-dockermgt: the docker mgt to send tc request (he can send other request)
 - mddash-model: we have XSD inside
 - mddash-sessionmgt: we have website, mpd genrator and gatway for mddash-dockermgt

##First get all demo

```
git clone git@github.com:dngroup/DemoMDDash.git
git submodule update --init --recursive #get submodule
cd docker
git checkout master
cd ..
```


## Website

 - Go to the folder of web site
```
cd DemoMDDash/mddash-sessionmgt/src/main/resources/static
```

##How to edit text of the demo

 - go to [website folder](website)
 - edit app/infos.json
 - title must match to addr on app/sources.json

## blue

```
ssh YOURLOGIN@ssh.enseirb-matmeca.fr
ssh user@homeb.tv -P 8022
ssh blue
cd project/demo_md_dash/
```  

##How to add/change demo

 - Go on [blue](#blue)
 - on the folder ` project/demo_md_dash/data/`
 - Add the new file on a directory
 - Change mpd to use correct server
 - Try if if work
```
http://server1.homeb.tv:8080/YOURFLODER/YOURMPD
```
 - On your git repository
 - Add the link to source.json on the [website](#website) app/sources.json
 - Commit and [push](#push-docker), [pull](#pull-docker)  docker on the server
 - Restart docker

##Commit-push
you have somme sub module git for that commit and push this before commit main project `mddash-sessionmgt/src/main/resources/static/NaCLDescriptionAggregator` and `docker`
```
git status
git add ....
git commit
git push
```


##Push docker

 - on your git folder
```bash
mvn clean package # this bluid docker image
docker push dngroup/sessionmgt
docker push dngroup/dockermgt
```
##Pull docker

 - Go on [blue](#blue)
 - on the folder ` project/demo_md_dash/composer/`
```
docker-compose pull
```  


##Restart docker

 - Go on [blue](#blue)
 - on the folder ` project/demo_md_dash/composer/`
```
docker-compose kill #or stop
docker-compose up -d #-d for deamon mode
```  


##How to push modification on server
 - [Commit-push your modification](#commit-push)
 - [Push your new docker](#push-docker)
 - [Pull the new docker](#pull-docker)
 - [Restart docker](restart-docker)
