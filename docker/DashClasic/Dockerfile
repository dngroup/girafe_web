# Dash.js classique
#
# VERSION       1.0

# ~~~~ Image base ~~~~
FROM node:wheezy
MAINTAINER David Bourasseau <dbourasseau@viotech.net>

RUN npm install -g grunt-cli
ADD dash.js dash.js
WORKDIR dash.js/build
RUN npm install
RUN grunt uglify
RUN grunt jsdoc --force
RUN grunt jshint
WORKDIR ../
ENTRYPOINT python -m SimpleHTTPServer 8001
