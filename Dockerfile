FROM node:6-alpine

# install script dependencies
RUN apk update && apk add sudo curl git wget bash binutils tar python make
RUN rm -rf /var/cache/apk/*

# setup folders
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install yarn dependencies
COPY ./package.json /usr/src/app
COPY ./yarn.lock /usr/src/app
RUN /bin/bash && touch ~/.bashrc && curl -o- -L https://yarnpkg.com/install.sh | bash
RUN npm install -g ember-cli@latest
RUN yarn install

# install source code
COPY . /usr/src/app
COPY ./server/config-example.js ./server/config.js

# define settings
RUN sed -i -e 's/URL="localhost"/URL="couchdb"/g' ./script/initcouch.sh
RUN sed -i -e "s/couchDbServer: 'localhost'/couchDbServer: 'couchdb'/g" ./server/config.js
RUN sed -i -e "s/localhost:5984/couchdb:5984/g" ./script/server

EXPOSE 4200

ENTRYPOINT ./script/initcouch.sh && npm start
