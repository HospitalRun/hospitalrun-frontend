import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Controller.extend(UserSession, {
  indexLinks: [
    'Appointments',
    'Labs',
    'Imaging',
    'Inventory',
    'Medication',
    'Patients',
    'Users'
  ],

  setupPermissions: function() {
    let permissions = this.get('defaultCapabilities');
    for (let capability in permissions) {
      if (this.currentUserCan(capability)) {
        this.set(`userCan_${capability}`, true);
      }
    }
  }.on('init'),

  activeLinks: function() {
    let activeLinks = [];
    let indexLinks = this.get('indexLinks');
    indexLinks.forEach(function(link) {
      let action = link.toLowerCase();
      if (this.currentUserCan(action)) {
        activeLinks.push({
          action: action,
          text: link
        });
      }
    }.bind(this));
    return activeLinks;
  }.property('indexLinks')

});
