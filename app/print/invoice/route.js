import Ember from 'ember';
import injectScript from 'ember-inject-script';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model(params) {
    return Ember.RSVP.hash({
      invoice: this.store.find('invoice', params.invoice_id),
      template: this.store.find('option', 'invoice_template')
        .catch(function(){
          return { isError: true };
        })
    });
  },
  
  afterModel() {
    return injectScript('//builds.emberjs.com/release/ember-template-compiler.js');
  }
 
});

