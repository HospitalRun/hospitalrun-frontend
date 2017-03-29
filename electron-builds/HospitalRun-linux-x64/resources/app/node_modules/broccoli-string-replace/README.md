# Broccoli's String Replace

[![Build Status](https://travis-ci.org/rwjblue/broccoli-string-replace.svg?branch=master)](https://travis-ci.org/rjackson/broccoli-string-replace)

## Summary

Uses [String.prototype.replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) to
replace matched patterns.

## Installation

```bash
npm install --save-dev broccoli-string-replace
```

## Usage

### Files

Replace `VERSION_STRING` with `1.6.5` in `app/main.js`:

```javascript
var replace = require('broccoli-string-replace');

var tree = replace('app', {
  files: [ 'main.js' ],
  pattern: {
    match: /VERSION_STRING/g,
    replacement: '1.6.5'
  }
});
```

## Documentation

### `replace(inputTree, options)`

---

`options.files` *{Array}*

The list of files to process the list of patterns against. This is an array of strings.

---

`options.patterns` *{Array}*

A list of objects with `match` and `replacement` properties.

---

`options.pattern` *{Object}*

A single pattern with `match` and `replacement` properties.

## ZOMG!!! TESTS?!?!!?

I know, right?

Running the tests:

```javascript
npm install
npm test
```

## License

This project is distributed under the MIT license.
