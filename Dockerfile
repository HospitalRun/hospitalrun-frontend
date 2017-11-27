FROM node:6-alpine

# install script dependencies
RUN apk update && apk add sudo curl git wget

# setup folders
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install npm dependencies
COPY ./package.json /usr/src/app
RUN npm install -g ember-cli@latest && npm install -g bower
RUN npm install

# install source code
COPY . /usr/src/app
RUN bower install --allow-root
COPY ./server/config-example.js ./server/config.js

# define settings
RUN sed -i -e 's/URL="localhost"/URL="couchdb"/g' ./script/initcouch.sh
RUN sed -i -e "s/couchDbServer: 'localhost'/couchDbServer: 'couchdb'/g" ./server/config.js
RUN sed -i -e "s/localhost:5984/couchdb:5984/g" ./script/server

EXPOSE 4200

ENTRYPOINT ./script/initcouch.sh && npm start
