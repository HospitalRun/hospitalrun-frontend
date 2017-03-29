import Ember from "ember";
import TabRoute from "ember-inspector/routes/tab";

const { RSVP: { Promise } } = Ember;

export default TabRoute.extend({
  model() {
    const port = this.get('port');
    return new Promise(function(resolve) {
      port.one('render:profilesAdded', function(message) {
        resolve(message.profiles);
      });
      port.send('render:watchProfiles');
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    if (model.length === 0) {
      controller.set('initialEmpty', true);
    }
    const port = this.get('port');
    port.on('render:profilesUpdated', this, this.profilesUpdated);
    port.on('render:profilesAdded', this, this.profilesAdded);
  },

  deactivate() {
    const port = this.get('port');
    port.off('render:profilesUpdated', this, this.profilesUpdated);
    port.off('render:profilesAdded', this, this.profilesAdded);
    port.send('render:releaseProfiles');
  },

  profilesUpdated(message) {
    this.set('controller.model', message.profiles);
  },

  profilesAdded(message) {
    const model = this.get('controller.model');
    const profiles = message.profiles;

    model.pushObjects(profiles);
  },

  actions: {
    clearProfiles() {
      this.get('port').send('render:clear');
    }
  }

});
