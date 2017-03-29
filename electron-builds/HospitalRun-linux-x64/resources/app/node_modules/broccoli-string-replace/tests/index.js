'use strict';

var replace = require('..');
var expect = require('expect.js');

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

describe('broccoli-simple-replace', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('can use a single pattern', function(){
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ 'matched-file.js' ],
      pattern: {
        match: 'REPLACE_ME',
        replacement: 'REPLACED!!!'
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = 'ZOMG, ZOMG\n\nREPLACED!!!\n\nZOMG, ZOMG\n';

      expect(actual).to.equal(expected);
    });
  })

  it('can use a regular expression in files', function(){
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ new RegExp('matched' + '(.*js)') ],
      pattern: {
        match: 'REPLACE_ME',
        replacement: 'REPLACED!!!'
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = 'ZOMG, ZOMG\n\nREPLACED!!!\n\nZOMG, ZOMG\n';

      expect(actual).to.equal(expected);
    });
  })

  it('can use a glob in files', function(){
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ '*.js' ],
      pattern: {
        match: 'REPLACE_ME',
        replacement: 'REPLACED!!!'
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = 'ZOMG, ZOMG\n\nREPLACED!!!\n\nZOMG, ZOMG\n';

      expect(actual).to.equal(expected);
    });
  })

  it('can use a function in files to find match', function(){
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ function(x) { return x.indexOf('matched') > -1; }  ],
      pattern: {
        match: 'REPLACE_ME',
        replacement: 'REPLACED!!!'
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = 'ZOMG, ZOMG\n\nREPLACED!!!\n\nZOMG, ZOMG\n';

      expect(actual).to.equal(expected);
    });
  })

  it('can use function in files to not match', function(){
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ function(x) { return x.indexOf('no-match') > -1; }  ],
      pattern: {
        match: 'REPLACE_ME',
        replacement: 'REPLACED!!!'
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = 'ZOMG, ZOMG\n\nREPLACE_ME\n\nZOMG, ZOMG\n';

      expect(actual).to.equal(expected);
    });
  })

  it('can accept a regex matcher', function(){
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ 'matched-file.js' ],
      pattern: {
        match: /REPL/,
        replacement: 'repl'
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = 'ZOMG, ZOMG\n\nreplACE_ME\n\nZOMG, ZOMG\n';

      expect(actual).to.equal(expected);
    });
  })

  it('can accept a function replacement', function(){
    var counter = 0;
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ 'matched-file.js' ],
      pattern: {
        match: /ZOMG/g,
        replacement: function() {
          return counter++;
        }
      }
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = '0, 1\n\nREPLACE_ME\n\n2, 3\n';

      expect(actual).to.equal(expected);
    });
  })

  it('can use multiple patterns', function(){
    var sourcePath = 'tests/fixtures/string-for-string';
    var tree = replace(sourcePath, {
      files: [ 'matched-file.js' ],
      patterns: [
        { match: 'REPLACE_ME', replacement: 'REPLACED!!!' },
        { match: 'ZOMG,', replacement: 'TEEHEE' }
      ]
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var actual = fs.readFileSync(dir + '/matched-file.js', { encoding: 'utf8'});
      var expected = 'TEEHEE ZOMG\n\nREPLACED!!!\n\nZOMG, ZOMG\n';

      expect(actual).to.equal(expected);
    });
  })
});
