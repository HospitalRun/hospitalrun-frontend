# Contribution Guidelines #

## Submitting a new issue ##

If you want to ensure that your issue gets fixed *fast* you should
attempt to reproduce the issue in an isolated example application that
you can share.

## Making a pull request ##

If you'd like to submit a pull request please adhere to the following:

1. Your code *must* be tested. Please TDD your code!
2. No single-character variables
3. Two-spaces instead of tabs

Please note that you must adhere to each of the aforementioned rules.
Failure to do so will result in an immediate closing of the pull
request. If you update and rebase the pull request to follow the
guidelines your pull request will be re-opened and considered for
inclusion.

## Testing ##

Tests are written using [QUnit](http://qunitjs.com/), and run by [http://karma-runner.github.io/0.12/index.html](Karma).
Code coverage analysis is collected by [Istanbul](http://gotwarlost.github.io/istanbul/).
Static code analysis is performed by [JSHint](http://jshint.com/) and [JSCS](http://jscs.info/).
Continuouse Integration testing is powered by [Travis CI](https://travis-ci.org/dockyard/qunit-notifications)
and [Code Climate](https://codeclimate.com/github/dockyard/qunit-notifications).

### Getting started ###

1. Clone this repository:

      git clone <repository url>

2. Install dependencies:

      npm install

3. Run tests locally:

      npm test

This command runs all the following:
  - `npm run lint` - check basic code style rules
  - `npm run codestyle` - check more advanced code style rules
  - `npm run karma-ci` - run all unit tests in PhantomJS - a headless browser -
     and generate a code coverage report
  - `npm run report` - display a quick summary of the code coverage. Complete
     code coverage report is available in `tests/coverage/index.html`.

### Advanced testing options ###

To develop, you can either:
  - Run `npm run karma` in your console and check results from the console
    directly or visit [http://localhost:9876/]
  - or, open `file://...path/to/your/repo/tests/index.html`

Also, you can troubleshoot PhantomJS errors by starting Karma with
`PhantomJS_debug` as a browser:

    npm run karma -- --browser PhantomJS_debug

Then, you can access the remote debugger at http://localhost:9000/.
