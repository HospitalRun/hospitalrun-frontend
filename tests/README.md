## How to write Unit tests in Ember

* http://www.programwitherik.com/ember-testing-with-ember-cli/

#### Testing Views
  - http://stackoverflow.com/questions/14903273/how-to-unit-test-views-in-ember-js
  - http://www.andymatthews.net/read/2014/03/26/Unit-Testing-Ember.js:-Handlebars-Helpers
  - 

## Test Framework Options

### QUnit

### Jasmine
* https://www.devmynd.com/blog/2014-1-ember-js-testing-with-jasmine/

### Mocha/Chai/Sinon
* http://mochajs.org/
* http://chaijs.com/
* http://sinonjs.org/

#### Test Runners
* Karma - http://karma-runner.github.io/0.12/plus/emberjs.html
* 

#### General Reading
* http://spin.atomicobject.com/2014/01/02/emberjs-testing-tooling/
* http://www.foraker.com/blog/google-spreadsheets-on-ember


## How Hospital Run implements unit tests 
* You'll be the first to know

### How to run the unit tests
* Run the ember test server: `ember test --server` 
  - This will monitor for changes to the source or the test and run them automatically.
* Hint: Add `&nocontainer=hidden` to testem results viewer to get rid of nasty white div:
http://localhost:7357/8986/tests/index.html?module=NavMenuComponent&nojshint=true&nocontainer=hidden

