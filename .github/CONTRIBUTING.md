# Contributing

HospitalRun is a community project. We invite your participation through
financial contributions, issues, and pull requests!

Contributions are always welcome. Before contributing please read the [code of conduct](https://github.com/HospitalRun/hospitalrun/blob/master/.github/CODE_OF_CONDUCT.md) and
[search the issue tracker](https://github.com/HospitalRun/hospitalrun-frontend/issues); your issue
may have already been discussed or fixed in `master`. If you're new to the project,
maybe you'd like to open a pull request to address one of [good-first-issue](https://github.com/HospitalRun/hospitalrun-frontend/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Make sure to checkout the [HospitalRun Contributing Guide](https://github.com/HospitalRun/hospitalrun/blob/master/.github/CONTRIBUTING.md)

To contribute,
[fork](https://help.github.com/articles/fork-a-repo/) this repo, commit your changes, and [send a Pull Request](https://help.github.com/articles/using-pull-requests/).

## Setting up the Local Development Environment

### Get the source code

1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repository
2. Open your favorite command line tool and navigate to the directory you wish to clone this repository to: `cd /path/to/clone`
3. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) your fork: `git clone git@github.com:{your username}/hospitalrun-frontend.git`
4. Navigate to the hosptialrun-frontend directory: `cd hospitalrun-frontend`

### Configure CouchDB

CouchDB is the server side database which data from the frontend will sync to. In order to login
to HospitalRun, CouchDB is required. For convienence, we have added a docker compose file in the
root of this project to help launch CouchDB. However, you could install and run CouchDB in any way you wish.

The following directions will be for running CouchDB via Docker Compose.

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Install [Docker Compose](https://docs.docker.com/compose/install/)
3. Run `docker-compose up --build -d` in the root directory.

This should launch a new CouchDB instance on `http://localhost:5984`, create system database, configure CouchDB as Single Node, enable CORS, create `hospitalrun` database, create a default admin with a username of `admin` and password of 'password'

4. Create a sample user with a username of `username` and password of 'password' to use new login page [#2137](https://github.com/HospitalRun/hospitalrun-frontend/pull/2137)

   ```
   curl -X PUT http://admin:password@localhost:5984/_users/org.couchdb.user:username -H "Accept: application/json" -H "Content-Type: application/json" -d '{"name": "username", "password": "password", "metadata": { "givenName": "John", "familyName": "Doe"}, "roles": [], "type": "user"}'
   ```

5. Launch `http://localhost:5984/_utils` to view Fauxton and perform administrative tasks.

**_Cleanup_**
To delete the development database, go to the root of the project and run `docker-compose down -v --rmi all --remove-orphans`

### Install dependencies & start the application

1. Install dependencies: `npm install`
2. Configure `REACT_APP_HOSPITALRUN_API=http://localhost:5984` environment variable in `.env`
3. Run the application `npm start`

## Online one-click setup for contributing

Contribute to HospitalRun using a fully featured online development environment that will automatically: clone the repo, install the dependencies and start the webserver.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/HospitalRun/hospitalrun-frontend)

### Optionally configure HospitalRun Server

In most cases, this is not needed to contribute to the HospitalRun Frontend Repository. The following instructions are for connecting to HospitalRun Server during development and are not intended to be for production use. For production deployments, see the deployment instructions/

1. Configure [HospitalRun Server](https://github.com/HospitalRun/hospitalrun-server)
2. Start the HospitalRun Development Server
3. Copy the `.env.example` file to `.env`
4. Change the `REACT_APP_HOSPITALRUN_API` variable to point to the HospitalRun Development Server.

### Potential Setup Issues

Some developers have reported the following errors and the corresponding fixes

### Problem with Project Dependency Tree

```
There might be a problem with the project dependency tree.
It is likely not a bug in Create React App, but something you need to fix locally.
The react-scripts package provided by Create React App requires a dependency:
  "babel-loader": "8.1.0"
Don't try to install it manually: your package manager does it automatically.
However, a different version of babel-loader was detected higher up in the tree:
  /path/to/hospitalrun/node_modules/babel-loader (version: 8.0.6)
Manually installing incompatible versions is known to cause hard-to-debug issues.
If you would prefer to ignore this check, add SKIP_PREFLIGHT_CHECK=true to an .env file in your project.
That will permanently disable this message but you might encounter other issues.
To fix the dependency tree, try following the steps below in the exact order:
  1. Delete package-lock.json (not package.json!) and/or yarn.lock in your project folder.
  2. Delete node_modules in your project folder.
  3. Remove "babel-loader" from dependencies and/or devDependencies in the package.json file in your project folder.
  4. Run npm install or yarn, depending on the package manager you use.
```

To fix this issue, add `SKIP_PREFLIGHT_CHECK=true` to the `.env` file.

## Running Tests and Linter

`yarn test:ci` will run the entire test suite

`yarn test` will run the test suite in watch mode

`yarn lint` will run the linter

`yarn lint:fix` will run the linter and fix fixable errors

## Useful Developer Tools

- [VSCode](https://code.visualstudio.com/)
- [VSCode React Extension Pack](https://marketplace.visualstudio.com/items?itemName=jawandarajbir.react-vscode-extension-pack)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux Developer Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)

## Working on an Issue

In order to optimize the workflow and to prevent multiple contributors working on the same issue without interactions, a contributor must ask to be assigned to an issue by one of the core team members: it's enough to ask it inside the specific issue.

## Feature Requests

Feature requests should be submitted in the
[issue tracker](https://github.com/HospitalRun/hospitalrun-frontend/issues), with a description of
the expected behavior & use case, where they’ll remain closed until sufficient interest,
[e.g. :+1: reactions](https://help.github.com/articles/about-discussions-in-issues-and-pull-requests/),
has been [shown by the community](https://github.com/HospitalRun/hospitalrun-frontend/issues?q=label%3A%22votes+needed%22+sort%3Areactions-%2B1-desc).
Before submitting a request, please search for similar ones in the
[closed issues](https://github.com/HospitalRun/hospitalrun-frontend/issues?q=is%3Aissue+is%3Aclosed+label%3Aenhancement).

## Pull Requests

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Contributor License Agreement

HospitalRun is a member of the [Open JS Foundation](https://openjsf.org/).
As such, we request that all contributors sign our
[contributor license agreement (CLA)](https://openjsf.org/about/the-openjs-foundation-cla/).

For more information about CLAs, please check out Alex Russell’s excellent post,
[“Why Do I Need to Sign This?”](https://infrequently.org/2008/06/why-do-i-need-to-sign-this/).
