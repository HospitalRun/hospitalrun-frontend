# Contributing to the Ember front end for HospitalRun

Contributions are welcome via pull requests and issues. Before submitting a pull request, please make sure all tests pass by running ```ember test```. This project uses the style guides from Dockyard for [Ember](https://github.com/dockyard/styleguides/blob/master/engineering/ember.md) and [JavaScript](https://github.com/dockyard/styleguides/blob/master/engineering/javascript.md). These style guides are enforced via ESLint, which is one of the linters described in the section on [linters](#linter) below.

## Slack / Communication

Project communication occurs primarily and intentionally via our project [Slack](https://hospitalrun.slack.com/). Those interested in / considering contribution are encouraged to [join](https://hospitalrun-slackin.herokuapp.com/). Project maintainers, contributors, and other community members in the Slack channel are usually available to answer questions, so feel free to ask about anything you need help with in the General channel. 

However, before you ask in Slack "what can I contribute to", be sure to keep reading this document for the answer to your question. :-)

Also, please avoid use of the `@everyone` and `@channel` commands in Slack, as you will be sending a notification to nearly 600 people. Just post your question and someone will respond soon.

While `@here` is discouraged as it notifies everyone who is active on Slack, if you have an announcement that the channel needs to hear urgently, use can be justified.

Generally, just posting your question will allow you to recieve a timely answer.

## Help Wanted

If you're looking for a way to contribute, the [Help Wanted](https://github.com/HospitalRun/hospitalrun-frontend/labels/Help%20Wanted) tag is the right place to start. Those issues are intended to be bugs / features / enhancements / technologies that have been vetted and we know we want to include in the project.

## In Progress

Issues (normally ones that were listed as Help Wanted) where people have committed to working on and delivering the issue are marked with the [In Progress](https://github.com/HospitalRun/hospitalrun-frontend/labels/Help%20Wanted) tag. Project maintainers will review status on those issues weekly and - if status changes - move the issue our of In Progress and back to Help Wanted in appropriate.

## Needs Requirements

[Needs Requirements](https://github.com/HospitalRun/hospitalrun-frontend/labels/Needs%20Requirements) is a tag we use to designate that someone with analyst interests / skills can/could/is needed to work out and document the requirements for the given issue. Simple requirements (or frankly anything that can be) should be recorded in the issue. More complicated formatting our documentation could be stored in the project wiki. To be honest, we're working this out still. So if you're interested in helping us sort out requirements, email joel@cure.org.

## Selecting a Issue / Feature to which you wish to contribute

This guide assumes a level of knowledge on how to use GitHub issues and pull requests. If you choose to contribute code, the standard procedure would to do the following:

1. Fork the master repo.
2. Add a comment in the given issue, referencing @tangollama to let our product management function know your intentions.
3. Use the GitHub issue to converse regarding requirements.
4. Submit a pull request at the point that you feel the feature is "ready to show."

## Guidelines for submitting a Pull Request

- When opening a PR for a specific issue already open, please use the `address #[issue number]` or `closes #[issue number]` syntax in the pull request description.
- Please keep your changes succinct in scope. Large pull requests with multiple changes to the codebase (i.e. multiple features) may be asked to be broken into multiple smaller pull requests.
- Please give as much detail as is relevant about your approach to the solution in the pull request description.
- When your code changes include any change to the visual UI, please include a screenshot of how your changes appear in the browser.

## Start Coding

This section is designed to help developers start coding in the project and understand the basic concepts and components used.

### Ember

To understand the project you'll have to understand [Ember](http://emberjs.com), and it is advisable that you'll follow the tutorial: [Create your own app](https://guides.emberjs.com/v2.10.0/tutorial/ember-cli/) to get an understanding of how Ember works and the basic folder structure. You can find more Ember guides [here](https://guides.emberjs.com/v2.10.0/).

### ES6

Since the project is based on Ember, it uses the ES6 standard for its client side code.

### Folder structure

The basic folder structure in Ember has the following folders and files:

| Folder Name | Purpose |
| ----------- | ------- |
| app/router.js | Defines routes and sub-routes in the application.
| app/index.html | The basic index html of the system (this file should almost never be changed).
| public/ | This directory contains assets such as images and fonts.
| vendor/ | This directory is where front-end dependencies (such as JavaScript or CSS) that are not managed by Bower go.
| dist/ | This folder is auto-generated by ember to contain all the project's compiled files and dependencies so that this folder can be copied as a stand-alone unit to be deployed on a server.
| tmp | Ember CLI temporary files live here.
| ember-cli-build.js | This file is an instruction on how to build the application.

In addition, these are descriptions of some extra folders and files in use in this project:

| Folder Name | Purpose |
| ----------- | ------- |
| server/ | This folder contains the basic definition for the application's backend.
| server/config.js | Basic configuration for the system, like CouchDB config, authentication etc.


### Pod directories

This project uses a folder structure called [Pods](http://cball.me/organize-your-ember-app-with-pods/) that is better suited for a large scale Ember application.

The basic folder structure for Ember puts controllers, routes and templates in three different directories. The Pods approach organizes the folders in correlation to the application routes and keeps all three files in the same folder for each view. 

### Extensions, Mixins & Abstracts

This project has a massive usage of npm modules for Ember, [Ember mixins](http://emberjs.com/api/classes/Ember.Mixin.html) and abstracts.

[ember-simple-auth](https://ember-simple-auth.com/) is an example of an Ember npm module used in the project to enable authentication and authorization.

[app/mixins/number-format.js](/app/mixins/number-format.js) is a mixin that, when augmenting a class, adds functions to it for working with numbers. 

[app/controllers/abstract-paged-controller.js](/app/controllers/abstract-paged-controller.js) is an abstract that takes care of paging and displaying results.
Using it is done like this:

```js
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
...
});
```

### Building the solution

Once you run `script/server` or `ember serve` the project is built and run. Afterwards you can change the models, controllers and templates and Ember will automatically update those files.

You can use `ember build` to actively build a project or `ember build --environment=production` to build the project for production.

### dist/ folder

`dist/` is an automatically generated folder by ember that contains all the dependencies for the project to run. You can copy this folder as is to your server which is a simple way to deploy the project (There are other ways which are not mentioned here).

### Ember data

To make requests to the server the project utilizes [Ember Data](http://emberjs.com/api/data/) and [REST Adapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html) to control requests between the client and the server.

### Adapters

Ember, by default uses [JSON API](http://jsonapi.org) as a JSON convention. [CouchDB](http://couchdb.apache.org/) uses a different JSON convention. For that reason, an adapter ([app/adapters/application.js](app/adapters/application.js) which uses [ember-pouch](https://github.com/nolanlawson/ember-pouch)) was put between client to server communications to change server bound requests to CouchDB JSON format and client bound responses to JSON API format.

### Components in use

[Ember components](http://emberjs.com/api/classes/Ember.Component.html) are reusable controls that you can integrate inside other pages/components.

### Linter

A linter is a small program that checks code for stylistic or programming errors. Linters are available for most syntaxes, from Python to HTML.

Programming is hard. We are bound to make mistakes. The big advantage of using a linter is that your code can be linted as you type (before saving your changes) and any errors are highlighted immediately, which is considerably easier than saving the file, switching to a terminal, running a linter, reading through a list of errors, then switching back to your editor to locate the errors!

In addition, linters can help to enforce coding standards, find unused variables, find formatting discrepancies etc.

**HospitalRun** uses the following linters:

1. [ESLint](http://eslint.org/) for ECMAScript/JavaScript. You can find the ESLint User guide [here](http://eslint.org/docs/user-guide/). ESLint is setup to use eslint-plugin-ember-suave, you can find more information about that [here](https://github.com/DockYard/eslint-plugin-ember-suave).
2. [stylelint](http://stylelint.io/) for Stylesheets. You can find the stylelint User guide [here](http://stylelint.io/user-guide/).
3. [ember-template-lint](https://github.com/rwjblue/ember-template-lint) for Ember templates.

### Using Local Cache

The database of **HospitalRun** uses [CouchDB](http://couchdb.apache.org/) to store all of its data online.
In parallel, it uses the offline feature of [PouchDB](https://pouchdb.com/) to store an offline copy of the database which syncs with the online instance on a different thread whenever the application is online.

### Data Access Flow

There are 3 database elements in play:

1. Cloud based CouchDB
2. PouchDB Online for online requests
3. PouchDB Offline for synchronizing  data on a separate thread

The application tries to access data via PouchDB Online which tries to access data on the online CouchDB. If this request succeeds no more actions are required.
As a failover mechanism, all outbound requests are monitored by the PouchDB service so they can be redirected to the local offline PouchDB instance.

The main reason for keeping two services of PouchDB on the client side is that keeping the PouchDB on the main thread, causes the UI to run slowly whenever a sync is running.

### Conflicts

When there's a conflict in data, as long is the conflict occures between two different records or two different fields, the conflict resolution will be able to solve the conflict.
If the conflict is between two versions of the same field, the later record value will apply.

### Tests

Travis CI is configured to run tests on GitHub, so when you open a pull requests the test suite will run automatically as a build which you can view in the merge box of the pull request. You can see the test output by clicking the `Details` link next to the build.

To run the test suite locally, use `ember test` from the project root.

New test should be added for any new features or views in the app. For more info about how to setup a new test, see the [Fixtures for Acceptance Tests](https://github.com/HospitalRun/hospitalrun-frontend#fixtures-for-acceptance-tests) section of the README.

## Guidelines to edit translations
If you know a language other than English and would like to help translate this app, please follow the following steps:

### Install necessary node modules
```npm install -g babel-cli eslint-cli babel-preset-es2015```

### Run script to populate missing translation terms
```npm run translation-sync```

After this step, you may see some file changes due to mismatches in translations of different languages. This script will take the English translation as the standard and populate the missing translations in other languages with empty string.

### Edit the translation file of your language
The translation files are in `app/locales/<language>/translations.json`

Open the translation file of your language then search for the string ```''```. Afterwards you fill in the quotation with the translated terms and save the file.

### Submit the pull request
Follow GitHub's guide to submit a pull request to the project. If you have trouble with this please post in Issues or contact a developer.



