frontend
========

Ember front end for HospitalRun

To run the app, you will need the following:

1. Install [ember-cli v1.13.1](https://www.npmjs.org/package/ember-cli): `npm install -g ember-cli@1.13.1`
2. Install [bower](https://www.npmjs.org/package/bower): `npm install -g bower`
3. Go to the `frontend` directory, and run the following:
    * `npm install` to install needed node modules.
    * `bower install` to install needed bower modules.
4. Install/configure [couchdb](http://couchdb.apache.org/)
  1. Download and install couchdb from http://couchdb.apache.org/#download
  2. Run `initcouch.sh` to setup couchdb with an admin user with the credentials `hradmin/test`.  
    * If you have just installed couchdb and have not setup a couchdb admin user, then run `initcouch.sh`.
    * If you have already created a couchdb admin, then run `initcouch.sh user pass` with the couch admin credentials (where user is the couchdb admin user and pass is the user's password).
5. Copy the server/config-example.js to server/config.js.
6. Start the server so you can view the repo in your browser by running `ember serve` from the `frontend` directory.
7. Go to `http://0.0.0.0:4200/` in a browser and login with username `hradmin` and password `test`.