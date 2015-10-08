import Ember from 'ember';
/**
 * Extend link-to to allow data-* attributes.
 */

export default {
  name: 'linkto-data-attr',

  initialize: function () {
    Ember.LinkView.reopen({
      init: function () {
        this._super();
        var self = this;
        Ember.keys(this).forEach(function (key) {
          if (key.substr(0, 5) === 'data-') {
            self.get('attributeBindings').pushObject(key);
          }
        });
      }
    });
  }
};
