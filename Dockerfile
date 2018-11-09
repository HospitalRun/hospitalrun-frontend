FROM node:6-alpine

# install script dependencies
RUN apk update && apk add \
  bash \
  curl \
  g++ \
  git \
  make \
  python \
  sudo \
  wget

# install global npm dependencies
RUN yarn global add ember-cli@latest

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package*.json /tmp/
RUN cd /tmp && yarn install --silent
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

# setup folders
WORKDIR /usr/src/app

# install source code
COPY . /usr/src/app
COPY ./server/config-example.js ./server/config.js

# define settings
RUN sed -i -e 's/URL="localhost"/URL="couchdb"/g' ./script/initcouch.sh
RUN sed -i -e "s/couchDbServer: 'localhost'/couchDbServer: 'couchdb'/g" ./server/config.js
RUN sed -i -e "s/localhost:5984/couchdb:5984/g" ./script/server.js

EXPOSE 4200

ENTRYPOINT ./script/initcouch.sh && yarn start
