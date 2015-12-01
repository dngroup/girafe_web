#How to edit a file


##Summary

[TOC]

 - [Resume](#Resume)
 - How to get all demo
 - How to edit texte of the demo
 - How to add/change demo
 - How to push modification on server
 -  


##Resume

You have 4 folder

 - docker: we have composer and all docker image configuration
 - mddash-dockermgt: the docker mgt to send tc request (he can send other request)
 - mddash-model: we have XSD inside
 - mddash-sessionmgt: we have website, mpd genrator and gatway for mddash-dockermgt

##First get all demo

     git clone git@github.com:dngroup/DemoMDDash.git
     git submodule update --init --recursive #get submodule
     cd docker
     git checkout master
     cd ..
