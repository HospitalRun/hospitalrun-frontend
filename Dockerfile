FROM node:argon

RUN npm install -g ember-cli
RUN npm install -g bower
RUN npm install -g phantomjs

RUN git clone https://github.com/facebook/watchman.git && cd watchman && git checkout v3.5.0 && ./autogen.sh && ./configure && make && make install

WORKDIR /hospitalrun-frontend

COPY package.json /hospitalrun-frontend
RUN npm install
COPY bower.json /hospitalrun-frontend
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN bower install

ADD . /hospitalrun-frontend

RUN cp server/config-example.js server/config.js

CMD ./script/initcouch.sh && ember serve
