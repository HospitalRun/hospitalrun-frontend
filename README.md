HospitalRun frontend
========

_Ember frontend for HospitalRun_

To run the development environment for this frontend you will need to have [Git](https://git-scm.com/), [Node.js](https://nodejs.org), [Ember CLI](http://ember-cli.com/), [Bower](http://bower.io/) and [CouchDB](http://couchdb.apache.org/) installed.

## Install
To install the frontend please do the following:

- Make sure you have installed [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Make sure you have installed [Node.js](https://nodejs.org/en/download/). Versions after 0.10.0 should work, but please note if you encounter errors using 5.x it may be necessary to upgrade your npm version:

```npm install npm -g```

NPM versions after 3.5.x should work.
- Install [ember-cli v1.13.13](https://www.npmjs.org/package/ember-cli): `npm install -g ember-cli@1.13.13`
- Install [bower](https://www.npmjs.org/package/bower): `npm install -g bower`
- Clone this repo with `git clone https://github.com/HospitalRun/hospitalrun-frontend`, go to the cloned folder and:
    1. `npm install` to install needed node modules.
    2. `bower install` to install needed bower modules.
- Install ands configure [CouchDB](http://couchdb.apache.org/)
  1. Download and install CouchDB from http://couchdb.apache.org/#download
  2. Create admin user:
    1. If you have just installed CouchDB and have no admin user, please run `initcouch.sh`. A user `hradmin` will be created with password: `test`.
    2. If you already have a CouchDB admin user, please run `initcouch.sh USER PASS` where `USER` and `PASS` are the CouchDB admin user credentials.
- Copy the `server/config-example.js` to `server/config.js`.

## Start
To start the frontend please do the following:

- Start the server by running `ember serve` in the repo folder.
- Go to [http://localhost:4200/](http://localhost:4200/) in a browser and login with username `hradmin` and password `test`.

## Testing

### Fixtures for Acceptance Tests

Fixtures are PouchDB dumps that are generated with [pouchdb-dump-cli](https://github.com/nolanlawson/pouchdb-dump-cli).

To create a fixture, run `pouchdb-dump http://localhost:5984/main -u hradmin -p test | cat > tests/fixtures/${name_of_fixture}.txt`.

To use a fixture, use `loadPouchDump(`${name_of_fixture})` in your acceptance test. For example,

```
test('visiting /patients', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/patients');
  andThen(function() {
    assert.equal(currentURL(), '/patients');
  });
});
```
Contributing
------------
Contributions are welcome via pull requests and issues.  Please see our [contributing guide](https://github.com/hospitalrun/hospitalrun-frontend/blob/master/CONTRIBUTING.md) for more details.
