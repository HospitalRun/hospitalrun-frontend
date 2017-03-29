# broccoli-babel-transpiler

[![Build Status](https://travis-ci.org/babel/broccoli-babel-transpiler.svg?branch=master)](https://travis-ci.org/babel/broccoli-babel-transpiler)
[![Build status](https://ci.appveyor.com/api/projects/status/a0nbd84m1x4y5fp5?svg=true)](https://ci.appveyor.com/project/embercli/broccoli-babel-transpiler)


A [Broccoli](https://github.com/broccolijs/broccoli) plugin which
transpiles ES6 to readable ES5 by using [babel](https://github.com/babel/babel).

## How to install?

```sh
$ npm install broccoli-babel-transpiler --save-dev
```

## How to use?

In your `Brocfile.js`:

```js
var esTranspiler = require('broccoli-babel-transpiler');
var scriptTree = esTranspiler(inputTree, options);
```

You can find [options](https://babeljs.io/docs/usage/options) at babel's
github repo.

### Examples

You'll find three example projects using this plugin in the repository [broccoli-babel-examples](https://github.com/givanse/broccoli-babel-examples).
Each one of them builds on top of the previous example so you can progess from bare minimum to ambitious development.

 * [es6-fruits](https://github.com/givanse/broccoli-babel-examples/tree/master/es6-fruits) - Execute a single ES6 script.
 * [es6-website](https://github.com/givanse/broccoli-babel-examples/tree/master/es6-website) - Build a simple website.
 * [es6-modules](https://github.com/givanse/broccoli-babel-examples/tree/master/es6-modules) - Handle modules and unit tests.

## About source map

Currently this plugin only supports inline source map. If you need
separate source map feature, you're welcome to submit a pull request.

## Advanced usage

`filterExtensions` is an option to limit (or expand) the set of file extensions that will be transformed.

The default `filterExtension` is `js`

```js
var esTranspiler = require('broccoli-babel-transpiler');
var scriptTree = esTranspiler(inputTree, {
    filterExtensions:['js', 'es6'] // babelize both .js and .es6 files
});
```

`exportModuleMetadata` is an option that can be used to write a JSON file to the output tree that gives you metadata about the tree's imports and exports.

## Polyfill

In order to use some of the ES6 features you must include the Babel [polyfill](http://babeljs.io/docs/usage/polyfill/#usage-in-browser).

You don't always need this, review which features need the polyfill here: [ES6 Features](https://babeljs.io/docs/learn-es6).

```js
var esTranspiler = require('broccoli-babel-transpiler');
var scriptTree = esTranspiler(inputTree, { browserPolyfill: true });
```

## Plugins

Use of custom plugins works similarly to `babel` itself. You would pass a `plugins` array in `options`:

```js
var esTranspiler = require('broccoli-babel-transpiler');
var applyFeatureFlags = require('babel-plugin-feature-flags');

var featureFlagPlugin = applyFeatureFlags({
  import: { module: 'ember-metal/features' },
  features: {
    'ember-metal-blah': true
  }
});

var scriptTree = esTranspiler(inputTree, {
  plugins: [
    featureFlagPlugin
  ]
});
```

### Caching

broccoli-babel-transpiler uses a persistent cache to enable rebuilds to be significantly faster (by avoiding transpilation for files that have not changed).
However, since a plugin can do many things to affect the transpiled output it must also influence the cache key to ensure transpiled files are rebuilt
if the plugin changes (or the plugins configuration).

In order to aid plugin developers in this process, broccoli-babel-transpiler will invoke two methods on a plugin so that it can augment the cache key:

* `cacheKey` - This method is used to describe any runtime information that may want to invalidate the cached result of each file transpilation. This is
  generally only needed when the configuration provided to the plugin is used to modify the AST output by a plugin like `babel-plugin-filter-imports` (module
  exports to strip from a build), `babel-plugin-feature-flags` (configured features and current status to strip or embed in a final build), or
  `babel-plugin-htmlbars-inline-precompile` (uses `ember-template-compiler.js` to compile inlined templates).
* `baseDir` - This method is expected to return the plugins base dir. The provided `baseDir` is used to ensure the cache is invalidated if any of the
  plugin's files change (including its deps). Each plugin should implement `baseDir` as: `Plugin.prototype.baseDir = function() { return \_\_dirname; };`.
