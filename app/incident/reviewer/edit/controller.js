import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
export default AbstractEditController.extend({
  incidentController: Ember.inject.controller('incident'),
  editController: Ember.inject.controller('incident/edit'),

  userList: Ember.computed.alias('incidentController.userList'),

  cancelAction: 'closeModal',
  updateCapability: 'add_reviewer',

  newReviewer: false,

  emailList: Ember.computed.map('userList', function(value) {
    return {
      value: value.get('displayName'),
      id: value.get('email')
    };
  }),

  title: function() {
    var isNew = this.get('model.isNew');
    let i18n = this.get('i18n');
    if (isNew) {
      return i18n.t('incident.titles.addReviewer');
    }
    return i18n.t('incident.titles.editReviewer');
  }.property('model.isNew'),

  beforeUpdate: function() {
    var email = this.get('model.reviewerEmail');
    if (!Ember.isEmpty(email)) {
      var userList = this.get('userList'),
          userObject = userList.findBy('email', email);
      if (!Ember.isEmpty(userObject)) {
        this.set('model.reviewerName', userObject.get('displayName'));
      }
    }
    if (this.get('model.isNew')) {
      this.set('newReviewer', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function(reviewer) {
    if (this.get('newReviewer')) {
      this.get('editController').send('addReviewer', reviewer);
    } else {
      this.send('closeModal');
    }
  }
});
