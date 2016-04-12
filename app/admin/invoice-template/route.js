import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import injectScript from 'ember-inject-script';

export default AbstractEditRoute.extend({
  hideNewButton: true,
  newTitle: 'Invoice Template',
  editTitle: 'Invoice Template',
  
  model: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      this.get('store').find('option', 'invoice_template').then(function(invoiceOptions) {
        resolve(invoiceOptions);
      }, function() {
        var store = this.get('store');
        var newConfig = store.push(store.normalize('option', {
          id: 'invoice_template',
          value: {
            invoiceHeader: 'Header',
            invoiceFooter: 'Footer'
          }
        }));
        resolve(newConfig);
      }.bind(this));
    }.bind(this));
  },
  
  afterModel() {
    return injectScript('//builds.emberjs.com/release/ember-template-compiler.js');
  }
});
