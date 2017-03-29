import Ember from 'ember';
const { Route, RSVP: { Promise }, getOwner } = Ember;

export default Route.extend({
  model() {
    let port = this.get('port');
    return new Promise(resolve => {
      port.on('general:applicationBooted', this, function(message) {
        if (message.booted) {
          port.off('general:applicationBooted');
          resolve();
        }
      });
      port.send('general:applicationBooted');
    });
  },

  setupController() {
    this.controllerFor('application').set('emberApplication', true);
    this.get('port').one('general:reset', this, this.reset);
  },

  reset() {
    getOwner(this).lookup('application:main').reset();
  },

  deactivate() {
    this.get('port').off('general:applicationBooted');
    this.get('port').off('general:reset', this, this.reset);
  }
});
