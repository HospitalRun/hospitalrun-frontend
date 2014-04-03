frontend
========

Ember front end for HospitalRun

To run the app, you will need the following:

1. Ember-cli npm install -g ember-cli.
2. Run npm-install in frontend dir to install needed node modules.
3. Install/configure couchdb http://couchdb.apache.org/#download
  1. Make the following changes to your couchdb local.ini
    * in the [httpd] section: enable_cors = true 
    * add the following section:
    ```
    [cors]
    origins = *
    credentials = true
    methods = GET, PUT, POST, HEAD, DELETE
    ```
  2. Go to Futon (http://0.0.0.0:5984/_utils/) and create an Admin user
4. In the frontend root directory, run ember server
5. Go to http://0.0.0.0:4200/ in a browser and login with your couchdb admin user


