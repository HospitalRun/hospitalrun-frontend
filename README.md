HospitalRun Ember Frontend
========
[![Snyk](https://snyk.io/test/github/hospitalrun/hospitalrun-frontend/badge.svg)](https://snyk.io/test/github/hospitalrun/hospitalrun-frontend) [![CouchDB](https://img.shields.io/badge/couchdb-1.x-green.svg)](http://couchdb.apache.org/) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/hospitalrun)

## Important Note
### We are now working on a new major version of HospitalRun. As soon as the [next branch](https://github.com/HospitalRun/hospitalrun-frontend/tree/next) will be ready, it will be merged onto master. Please don't do any PR to this branch. Use this README just as installation reference for the current version.
_Ember frontend for [HospitalRun](http://hospitalrun.io/): free software for developing world hospitals_

To run the development environment for this frontend you will need to have [Git](https://git-scm.com/), [Node.js](https://nodejs.org), [Ember CLI](http://ember-cli.com/), [Bower](http://bower.io/), and [CouchDB](http://couchdb.apache.org/) installed.

## Table of contents

- [Contributing](#contributing)
- [Installation](#installation)
- [Running the application](#running-the-application)
- [Running with Docker](#running-with-docker)
- [Accessing HospitalRun with Docker Toolbox](#accessing-hospitalrun-with-docker-toolbox)
- [Accessing HospitalRun with Docker or Docker-compose](#accessing-hospitalrun-with-docker-or-docker-compose)
- [Troubleshooting your local environment](#troubleshooting-your-local-environment)
- [Loading sample data](#loading-sample-data)
- [Testing](#testing)
- [Contributing](#contributing-1)
- [Start coding](#start-coding)
- [Further Reading / Useful Links](#further-reading--useful-links)
- [Experimental](#experimental)
- [Frequently Asked Questions](#frequently-asked-questions)

## Contributing

Contributions are welcome via pull requests and issues.  Please see our [contributing guide](https://github.com/hospitalrun/hospitalrun-frontend/blob/master/.github/CONTRIBUTING.md) for more details, including a link to join our project Slack.

## Installation
To install the frontend please do the following:

1. Make sure you have installed [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
2. Make sure you have installed [Node.js](https://nodejs.org/en/download/). Versions 6.0.0 and higher should work. We recommend that you use the most-recent "Active LTS" version of Node.js.
3. Make sure you have yarn installed [Yarn](https://yarnpkg.com/)
4. Install [ember-cli latest](https://www.npmjs.org/package/ember-cli): `yarn global add ember-cli@latest`.
   Depending on your [npm permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions) you might need root access to install ember-cli.
5. Clone this repo with `git clone https://github.com/HospitalRun/hospitalrun-frontend`, go to the cloned folder and run 

```
yarn install
```

  - **Note:** *If you just want to use the project, cloning is the best option. However, if you wish to contribute to the project, you will need to fork the project first, and then clone your `hospitalrun-frontend` fork and make your contributions via a branch on your fork.*
6. Install and configure [CouchDB](http://couchdb.apache.org/):
    1. Download and install CouchDB from http://couchdb.apache.org/#download.
    2. Start CouchDB:
        1. If you downloaded the installed app, navigate to CouchDB and double-click on the application.
        2. If you installed CouchDB via Homebrew or some other command line tool, launch the tool from the command line.
        3. If you're stuck with the installation, check out the instructions published here: http://docs.couchdb.org/en/1.6.1/install/index.html
    3. Verify that CouchDB is running by successfully navigating to 127.0.0.1:5984/_utils.  If that fails, check the installation guide for CouchDB: http://docs.couchdb.org/en/1.6.1/install/index.html.
    4. Create admin user:
        1. If you are running CouchDB 1.x:
            1. If you have just installed CouchDB and have no admin user, please run `./script/initcouch.sh` in the folder you cloned the HospitalRun repo.  A user `hradmin` will be created with password `test`.
            2. If you already have a CouchDB admin user, please run `./script/initcouch.sh USER PASS` in the folder you cloned the HospitalRun repo.  `USER` and `PASS` are the CouchDB admin user credentials.
        2. If you are running CouchDB 2.x (experimental):
            1. HospitalRun currently does not fully support CouchDB 2.x, but you are welcome to try using it.  Most functionality should work but currently creating and/or editing users does not work in CouchDB 2.x.  See https://github.com/HospitalRun/hospitalrun-frontend/issues/953 for more details.
            2. If you have just installed CouchDB and have no admin user, please run `./script/initcouch2.sh` in the folder you cloned the HospitalRun repo.  A user `hradmin` will be created with password `test`.
            3. If you already have a CouchDB admin user, please run `./script/initcouch2.sh USER PASS` in the folder you cloned the HospitalRun repo.  `USER` and `PASS` are the CouchDB admin user credentials.
7. Copy the `server/config-example.js` to `server/config.js` in the folder you cloned the HospitalRun repo.  If you already had a CouchDB admin user that you passed into the couch script (`./script/initcouch.sh USER PASS`), then you will need to modify the `couchAdminUser` and `couchAdminPassword` values in `server/config.js` to reflect those credentials. (*Note: If on Mac, you need to make sure CouchDB can be run. See [How to open an app from an unidentified developer and exempt it from Gatekeeper](https://support.apple.com/en-us/HT202491).*)
8. Verify that CouchDB is running by visiting: http://127.0.0.1:5984/_utils/#login
   and logging in with the with the credentials you just created from steps 6 and 7.
   - If the page returns an error or 404:
     - Run `make serve`, it will start couchdb, install npm dependencies and start the server.
     - Or start the application from your applications folder.


## Running the application
To start the frontend please do the following:

- Start the server by running `yarn start` in the repo folder.  If `yarn start` doesn't work for you, try `ember serve` as an alternative.
- Go to [http://localhost:4200/](http://localhost:4200/) in a browser and login with username `hradmin` and password `test`.

## Running with Docker

### Running With Docker Engine
To run HospitalRun with [Docker](https://www.docker.com/) please do the following:
- Go to [https://docs.docker.com/engine/installation](https://docs.docker.com/engine/installation) to download and install Docker.
- Clone the repository with the command `git clone https://github.com/HospitalRun/hospitalrun-frontend.git`.
- Change to the hospitalrun-frontend directory `cd hospitalrun-frontend`.
- Build the HospitalRun image with `docker build -t hospitalrun-frontend .`.
- Execute `docker run -it --name couchdb -d couchdb:1.7.1` to create the couchdb container.
- Execute `docker run -it --name hospitalrun-frontend -p 4200:4200 --link couchdb:couchdb -d hospitalrun-frontend` to create the HospitalRun container.

### Running with Docker Compose
To run HospitalRun with Docker-compose please do the following:
- Go to [https://docs.docker.com/compose/install](https://docs.docker.com/compose/install/) to install Docker-compose.
- Execute `docker-compose up` to reduce the steps to build and run the application.

### Accessing HospitalRun with Docker Toolbox
If you are running with Docker Toolbox you will have to run the following commands to get the IP of the docker machine where hospitalrun-frontend is running with the following:
- Run the following command to get the ip of the docker machine that the image was created on `docker-machine ip default`.
- Go to `http://<docker-machine ip>:4200` in a browser and login with username `hradmin` and password `test`.

### Accessing HospitalRun with Docker or Docker-compose
If you are not running with Docker toolbox, please do the following:
- Go to `http://localhost:4200` in a browser and login with username `hradmin` and password `test`.

### Troubleshooting your local environment
Always make sure to `git pull` and get the latest from master.

The app will usually tell you when something needs to happen (i.e. if you try to `yarn start` and npm is out of date, it will tell you to run `yarn update`. But If you run into problems you can't resolve, feel free to open an issue, or ask for help in the [HospitalRun Slack channel](https://hospitalrun.slack.com/) (you can request an invite [here](https://hospitalrun-slackin.herokuapp.com/)).

Otherwise, here are some tips for common issues:

**The browser shows only a loading dialog**

Is your server (still) running? Is CouchDB running? If not, that's probably the issue.

**My changes aren't showing up in the browser**

Try a browser refresh `cmd + r`.

**ERR! stack python2: command not found**

`yarn install` requires Python 2 to build some dependencies.
Make sure `python2` is accessible from the current working directory.

If you're using [pyenv](https://github.com/pyenv/pyenv), you can run the following to override the Python version used in the current working directory:
```
$ pyenv install 2.7.15
$ pyenv local 2.7.15
```

## Loading sample data
If you would like to load sample data, you can do so by navigating to **Load DB** under the Administration menu.  You should see the following screen:

![Load DB screenshot](screenshots/load-db.png)


Click on ***Choose File*** and select the file **sample-data.txt** which is included in the root directory of the repo at [sample-data.txt](sample-data.txt).
Next, click on ***Load File***.  When the database load is complete a message will appear indicating if the load was successful.

## Testing

### Fixtures for Acceptance Tests

Fixtures are [PouchDB](https://pouchdb.com/) dumps that are generated with [pouchdb-dump-cli](https://github.com/nolanlawson/pouchdb-dump-cli).

To create a fixture, run `pouchdb-dump http://localhost:5984/main -u hradmin -p test | cat > tests/fixtures/${name_of_fixture}.txt`.

To use a fixture, use `runWithPouchDump(${name_of_fixture}, function(){..});` in your acceptance test. For example:

```js
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

### Running Tests Locally

To run the test suite locally while developing, just run `ember test` from the project root.

Tests will also run automatically via Travis CI when you push a branch to the repository or a pull request. You can view output by going to the Travis test status from the Pull Request merge box.

## Contributing

Again, contributions are welcome via pull requests and issues.  Please see our [contributing guide](https://github.com/hospitalrun/hospitalrun-frontend/blob/master/.github/CONTRIBUTING.md) for more details.

**Seriously, please read the [Contribution Guide](https://github.com/hospitalrun/hospitalrun-frontend/blob/master/.github/CONTRIBUTING.md).**

## Team

_HospitalRun_ is the result of the work of a great community.

**Lead Maintainer:**
* [__Maksim Sinik__](https://github.com/fox1t)

### Core Team
* [__Riccardo Gulin__](https://github.com/bazuzu666)
* [__Matteo Vivona__](https://github.com/tehKapa)
* [__Stefano Casasola__](https://github.com/irvelervel)
* [__Stefano Miceli__](https://github.com/StefanoMiC)

### Contributors

[![Contributors](https://opencollective.com/hospitalrun/contributors.svg?width=960&button=false)](https://github.com/HospitalRun/hospitalrun-frontend/graphs/contributors) 

## Start Coding
To start coding and understand the frameworks, concepts and structure of the project, please read:
[Contribution Guide: Start Coding](.github/CONTRIBUTING.md#start-coding).

## Further Reading / Useful Links

* [Ember.js](http://emberjs.com/)
* [Ember CLI](http://www.ember-cli.com/)
* Development Browser Extensions
  * [Ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [Ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Experimental

### Make
If you are willing to try using `make`, ensure you have installed Git, Node.js and CouchDB (steps 1, 2 and 7 above), you may skip the rest.  This requires CouchDB in the path to work correctly.
* Run `make serve`, it will start CouchDB, install npm dependencies and start the server.
* Run `make all` to run all tests and build the app.
* Look into `Makefile` to figure other targets available.

### Cloud 9 Development Environment
[Documented in the project wiki](https://github.com/HospitalRun/hospitalrun-frontend/wiki/Optional:-Cloud9-Development-Environment)

## Frequently Asked Questions

**Q: What is the difference between hospitalrun-frontend and hospitalrun-server?**

Frontend is the primary repository and is used for development purposes. Server is the node backend, if you are looking to run HospitalRun in a clinical setting, you should use server.


