# ember-new-computed

This addon allows usage of the new Ember Computed syntax as described in
[emberjs/rfcs#11](https://github.com/emberjs/rfcs/pull/11) in older versions of Ember.

For versions prior to 1.12.0-beta.1 this addon will allow usage of the new syntax by polyfilling
but as of Ember 1.12.0-beta.1 a polyfill is not needed and the internal implementation of
`Ember.computed` is used.

## Usage

```javascript
import Ember from 'ember';
import computed from 'ember-new-computed';

export default Ember.Object({
  first: null,
  last: null,
  name: computed('first', 'last', {
    get: function() {
      return this.get('first') + ' ' + this.get('last');
    },
    set: function(key, value) {
      var [ first, last ] = value.split(' ');

      this.set('first', first);
      this.set('last', last);
    }
  }),
  // All `Ember.computed` helpers exists as well
  fullName: computed.reads('name')
});
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
