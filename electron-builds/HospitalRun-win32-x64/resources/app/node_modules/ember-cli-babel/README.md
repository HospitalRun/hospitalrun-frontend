# ember-cli-babel

[![Build Status](https://travis-ci.org/babel/ember-cli-babel.svg?branch=master)](https://travis-ci.org/babel/ember-cli-babel)
[![Build status](https://ci.appveyor.com/api/projects/status/2a6pspve1wrwwyj5/branch/master?svg=true)](https://ci.appveyor.com/project/embercli/ember-cli-babel/branch/master)


This Ember-CLI plugin uses [Babel](https://babeljs.io/) to allow you to use ES6 syntax with your
Ember-CLI project.

## Installation

```
npm install --save-dev ember-cli-babel
```

## Usage

This plugin should work without any configuration after installing. By default it will take every `.js` file
in your project and run it through the Babel transpiler to convert the ES6 code to ES5. Running existing ES5 code
through the transpiler shouldn't change the code at all (likely just a format change if it does).

If you need to customize the way that Babel transforms your code, you can do it by passing in any of the options
found [here](https://github.com/babel/babel.github.io/blob/5.0.0/docs/usage/options.md). Example:

```js
// ember-cli-build.js

var app = new EmberApp({
  babel: {
    // disable comments
    comments: false,
    // don't transpile arrow and generator functions
    blacklist: [
      'es6.arrowFunctions',
      'regenerator'
    ]
  }
});
```

### Polyfill

Babel comes with a polyfill that includes a custom [regenerator runtime](https://github.com/facebook/regenerator/blob/master/runtime.js)
and [core.js](https://github.com/zloirock/core-js). Many transformations will work without it, but for full support you
must include the polyfill in your app. The [Babel feature tour](https://babeljs.io/docs/tour/) includes a note for
features that require the polyfill to work.

To include it in your app, pass `includePolyfill: true` in your `babel` options.

### Features

Out of the box without a polyfill the following ES6 features are enabled:

| Feature  | Supported |
| ------------- | ------------- |
| Arrows and Lexical This | YES |
| Classes | YES |
| Enhanced Object Literals | YES |
| Template Strings | YES |
| Destructuring | YES |
| Default + Rest + Spread | YES |
| Let + Const | YES |
| Iterators + For..Of | NO |
| Generators | NO |
| Comprehensions | YES |
| Unicode | YES |
| Modules | YES |
| Module Loaders | NO |
| Map + Set + WeakMap + WeakSet | NO |
| Proxies | NO |
| Symbols | NO |
| Subclassable Built-ins | PARTIAL |
| Math + Number + String + Object APIs | NO |
| Binary and Octal Literals | PARTIAL |
| Promises | NO |
| Reflect API | NO |
| Tail Calls | PARTIAL |

See the [Babel docs](https://babeljs.io/docs/learn-es2015) for more details

### About Modules

Ember-CLI uses its own ES6 module transpiler for the custom Ember resolver that it uses. Because of that,
this plugin disables Babel module compilation by blacklisting that transform. If you find that you want to use
the Babel module transform instead of the Ember-CLI one, you'll have to explicitly set `compileModules` to `true`
in your configuration. If `compileModules` is anything other than `true`, this plugin will leave the module
syntax compilation up to Ember-CLI.
