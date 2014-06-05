frontend
========

Ember front end for HospitalRun

To run the app, you will need the following:

1. Install [ember-cli](https://www.npmjs.org/package/ember-cli): `npm install -g ember-cli`
2. Go to `frontend` directory, and run `npm-install` to install needed node modules.
3. Install/configure [couchdb](http://couchdb.apache.org/)
  1. Download and install couchdb from http://couchdb.apache.org/#download
  2. Run `initcouch.sh` to setup couchdb with an admin user with the credentials `hradmin/test`.  
  3. -OR- do the following
    * Go to Futon (`http://0.0.0.0:5984/_utils/`) 
    * Look for the "Welcome to Admin Party!" text down in the bottom right and click on "Fix this"
    * Create an admin user via the prompt that is displayed
    * Click on Create Database in the upper left corner
    * Create a database named `main`
    * Again click on Create Database in the upper left corner
    * Create a database named `config`
4. Start the server so you can view the repo in your browser by running `ember serve` from the `frontend` directory.
5. Go to `http://0.0.0.0:4200/` in a browser and login with your couchdb admin user.
