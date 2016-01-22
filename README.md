HospitalRun frontend
========

_Ember frontend for HospitalRun_

[![Build Status](https://travis-ci.org/HospitalRun/hospitalrun-frontend.svg?branch=master)](https://travis-ci.org/HospitalRun/hospitalrun-frontend)

To run the development environment for this frontend you will need to have [Git](https://git-scm.com/), [Node.js](https://nodejs.org), [Ember CLI](http://ember-cli.com/), [Bower](http://bower.io/) and [CouchDB](http://couchdb.apache.org/) installed.

## Install
To install the frontend please do the following:

- Make sure you have installed [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Make sure you have installed [Node.js](https://nodejs.org/en/download/). Versions after 0.10.0 should work, but please note if you encounter errors using 5.x it may be necessary to upgrade your npm version. Versions after 3.5.x should work:
    1. `npm install -g npm`
- Install [ember-cli v1.13.14](https://www.npmjs.org/package/ember-cli): `npm install -g ember-cli@1.13.14`
- Install [bower](https://www.npmjs.org/package/bower): `npm install -g bower`
- Clone this repo with `git clone https://github.com/HospitalRun/hospitalrun-frontend`, go to the cloned folder and:
    1. `npm install` to install needed node modules.
    2. `bower install` to install needed bower modules.
    3. `npm install -g phantomjs2` to install PhantomJS2, which is needed to run tests.  If you are using Linux, you will need to build PhantomJS from source following directions here: http://phantomjs.org/download.html.
- Install and configure [CouchDB](http://couchdb.apache.org/)
  1. Download and install CouchDB from http://couchdb.apache.org/#download
  2. Create admin user:
    1. If you have just installed CouchDB and have no admin user, please run `initcouch.sh`. A user `hradmin` will be created with password: `test`.
    2. If you already have a CouchDB admin user, please run `initcouch.sh USER PASS` where `USER` and `PASS` are the CouchDB admin user credentials.
- Copy the `server/config-example.js` to `server/config.js`.

## Start
To start the frontend please do the following:

- Start the server by running `ember serve` in the repo folder.
- Go to [http://localhost:4200/](http://localhost:4200/) in a browser and login with username `hradmin` and password `test`.

### Troubleshooting your local environment
Always make sure to `git pull` and get the latest from master. 

The app will usually tell you when something needs to happen (i.e. if you try to `ember serve` and npm is out of date, it will tell you to run `npm update`. But If you run into problems you can't resolve, feel free to open an issue, or ask for help in the [HospitalRun Slack channel](https://hospitalrun.slack.com/) (you can request an invite [here](https://hospitalrun-slackin.herokuapp.com/)).

Otherwise, here are some tips for common issues:

**The browser shows only a loading dialog**

Is your server (still) running? Is Couch running? If not, that's problably the issue.

**My changes aren't showing up in the browser**

Try a browser refresh `cmd + r`.

## Loading sample data
If you would like to load sample data, you can do so by navigating to **Load DB** under the Adminstration menu.  You should see the following screen:
![Load DB screenshot](screenshots/load-db.png)

Click on ***Choose File*** and select the file **sample-data.txt** which is included in root directory of the repo at [sample-data.txt](sample-data.txt).
Next, click on ***Load File***.  When the database load is complete a message will appear indicating if the load was successful.

## Testing

### Fixtures for Acceptance Tests

Fixtures are PouchDB dumps that are generated with [pouchdb-dump-cli](https://github.com/nolanlawson/pouchdb-dump-cli).

To create a fixture, run `pouchdb-dump http://localhost:5984/main -u hradmin -p test | cat > tests/fixtures/${name_of_fixture}.txt`.

To use a fixture, use `runWithPouchDump(${name_of_fixture}, function(){..});` in your acceptance test. For example,

```
test('visiting /patients', function(assert) {
  runWithPouchDump('default', function() {
    //Actual test code here
    authenticateUser();
    visit('/patients');
    andThen(function() {
      assert.equal(currentURL(), '/patients');
    });
  });
});
```
Contributing
------------
Contributions are welcome via pull requests and issues.  Please see our [contributing guide](https://github.com/hospitalrun/hospitalrun-frontend/blob/master/CONTRIBUTING.md) for more details.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
