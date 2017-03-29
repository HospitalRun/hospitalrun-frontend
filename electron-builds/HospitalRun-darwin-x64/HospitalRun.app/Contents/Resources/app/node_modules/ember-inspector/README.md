Ember Inspector [![Build Status](https://secure.travis-ci.org/emberjs/ember-inspector.svg?branch=master)](https://travis-ci.org/emberjs/ember-inspector)
===============

Adds an Ember tab to Chrome or Firefox Developer Tools that allows you to inspect
Ember objects in your application.

Installation
------------

### Chrome

Install the extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi).

OR:

- Clone the repository
- cd into the repo directory
- run `npm install && bower install`
- run `npm install -g ember-cli`
- run `npm run build` to build the `dist` directory
- Visit chrome://extensions in chrome
- Make sure `Developer mode` is checked
- Click on 'Load unpacked extension...'
- Choose the `dist/chrome` folder in the cloned repo
- Close and re-open developer tools if it's already open

### Firefox

Install the [Firefox addon](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/).

OR:

- Clone the repository
- cd into the repo directory
- run `npm install && bower install`
- run `npm install -g ember-cli`
- run `npm run build:xpi` to build the `dist` directory, download Firefox Addon SDK and build Firefox Addon XPI to 'tmp/xpi/ember-inspector.xpi'
  or `npm run run-xpi` to run the Firefox Addon in a temporary profile (or use `FIREFOX_BIN` and `FIREFOX_PROFILE` to customize Firefox profile directory and Firefox binary used to run the extension)

### Opera

- Clone the repository
- cd into the repo directory
- run `npm install`
- run `npm install -g ember-cli`
- run `npm run build` to build the `dist` directory
- Visit chrome://extensions in chrome
- Make sure `Developer mode` is checked
- Click on 'Load unpacked extension...'
- Choose the `dist/chrome` folder in the cloned repo
- Close and re-open developer tools if it's already open


### Bookmarklet (All Browsers)


```javascript
javascript: (function() { var s = document.createElement('script'); s.src = '//ember-extension.s3.amazonaws.com/dist_bookmarklet/load_inspector.js'; document.body.appendChild(s); }());
```

Internet explorer will open an iframe instead of a popup due to the lack of support for cross-origin messaging.

For development:

- run `npm run serve:bookmarklet`
- create a bookmark (make sure you unblock the popup when you run the bookmarklet):

```javascript
javascript: (function() { var s = document.createElement('script'); s.src = 'http://localhost:9191/bookmarklet/load_inspector.js'; document.body.appendChild(s); }());
```


Building and Testing:
--------------------

Run `npm install && npm install -g ember-cli && npm install -g bower && bower install && npm install -g grunt-cli` to install the required modules.

- `npm run build` to build the files in the `dist` directory
- `npm run watch` To watch the files and re-build in `dist` when anything changes (useful during development).
- `npm test` To run the tests in the terminal
- `npm run build:xpi` to download and build Firefox Addon XPI into `tmp/xpi/ember-inspector.xpi`
- `npm run run-xpi` to run the Firefox Addon XPI on a temporary new profile (or use `FIREFOX_BIN` and `FIREFOX_PROFILE` to customize Firefox profile directory and Firefox binary used to run the extension)
- `npm start` To start the test server at `localhost:4200/testing/tests`


Deploy new version:
-----------

#### Patch versions

Patch versions are only committed to the stable branch. So we need to cherry-pick the commits we need from master and bump stable to the new patch version.

- `git checkout stable`
- Cherry-pick the needed commits from master to stable
- Bump the patch version in package.json. Add the change log entry and commit.
- Follow the "Steps to publish" below.
- `git checkout master`
- Commit the change log entry to the master branch.

#### Minor and major versions

When releasing a major/minor version, master would already have this version set, so what we need to do is to merge master into stable and release.

- Add the new minor/major version's change log entry in `CHANGELOG.md` and commit to master.
- `git checkout stable`
- `git merge -X theirs master`
- Follow the "Steps to publish" steps below.
- `git checkout master`
- Update `package.json` to the future major/minor version.

#### Steps to publish

- Push the `stable` branch to github (this will publish the bookmarklet version).
- `npm run build:production`
- Publish `dist/chrome/ember-inspector.zip` to the Chrome web store
- Publish `tmp/xpi/ember-inspector.xpi` to the Mozilla Addons
- `npm publish ./`
- `git tag` the new version

### Locking a version

We can take a snapshot of the current inspector version to support a specific Ember version range. This allows us to stop supporting old Ember versions in master without breaking the published inspector for old Ember apps. It works by serving a different inspector version based on the current app's Ember version.

The Ember versions supported by the current inspector are indicated in the `emberVersionsSupported` array in `package.json`.

Here are the steps to lock an inspector version:

- Update `package.json`'s `emberVersionsSupported`: add a second element that indicates the minimum Ember version this inspector *does not* support.
- Release a new version (See "Minor and major versions"). Create a branch for this version.
- Run `npm run lock-version`. This will build, compress, and upload this version to S3.
- Update `package.json`'s `previousEmberVersionsSupported`: add the first Ember version supported by the recently locked version (the first element in the `emberVersionsSupported` array).
- Update `package.json`'s `emberVersionsSupported`: Move the second element in the array to the first position. Add an empty string as the second element to indicate there's currently no maximum Ember version supported yet.
- Commit.

### Window Messages

The Ember Inspector uses window messages, so if you are using window messages in your application code, make sure you [verify the sender](https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage#Security_concerns) and add checks to your event listener so as not to conflict with the inspector's messages.
