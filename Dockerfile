FROM ubuntu:14.04

# install couchdb
RUN apt-get update && apt-get install curl sudo git wget -y

# install hospital run
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get update && apt-get install nodejs -y
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install -g npm && npm install -g ember-cli@latest && npm install -g bower
RUN npm install
RUN bower install --allow-root
COPY ./server/config-example.js ./server/config.js

RUN sed -i -e 's/URL="localhost"/URL="couchdb"/g' ./script/initcouch.sh
RUN sed -i -e "s/couchDbServer: 'localhost'/couchDbServer: 'couchdb'/g" ./server/config.js
RUN sed -i -e "s/localhost:5984/couchdb:5984/g" ./script/server

EXPOSE 4200

ENTRYPOINT ./script/initcouch.sh && npm start
