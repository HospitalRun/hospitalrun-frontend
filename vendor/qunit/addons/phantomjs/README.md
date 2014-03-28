# PhantomJS Runner #
A PhantomJS-powered headless test runner, providing basic console output for QUnit tests.  

### Usage ###
```bash
  phantomjs runner.js [url-of-your-qunit-testsuite] [timeout-in-seconds]
```

### Example ###
```bash
  phantomjs runner.js http://localhost/qunit/test/index.html
```

### Notes ###
 - Requires [PhantomJS](http://phantomjs.org/) 1.6+ (1.7+ recommended).
 - If you're using Grunt, you should take a look at its [qunit task](https://github.com/gruntjs/grunt-contrib-qunit).
