import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const { set } = Ember;

export default AbstractEditRoute.extend({
  editTitle: t('labels.editUser'),
  modelName: 'user',
  newTitle: t('labels.newUser'),

  getNewData() {
    return Ember.RSVP.resolve({
      roles: ['Data Entry', 'user']
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    this.store.findAll('user').then(function(users) {
      set(controller, 'users', users);
    }).catch((err) => this.send('error', err));
  }
});
