frontend
========

Ember front end for HospitalRun

To run the app, you will need the following:

1. Install [ember-cli](https://www.npmjs.org/package/ember-cli): `npm install -g ember-cli`
2. Go to `frontend` directory, and run `npm-install` to install needed node modules.
3. Install/configure [couchdb](http://couchdb.apache.org/)
  1. Download and install couchdb from http://couchdb.apache.org/#download
  2. Open `local.ini`, and make the following changes:
    * in the [httpd] section: enable_cors = true
    * add the following section:
    ```
    [cors]
    origins = *
    credentials = true
    methods = GET, PUT, POST, HEAD, DELETE
    ```
  2. Go to Futon (http://0.0.0.0:5984/_utils/) and create an Admin user
4. Start the server so you can view the repo in your browser by running `ember server` from the `frontend` directory.
5. Go to http://0.0.0.0:4200/ in a browser and login with your couchdb admin user
