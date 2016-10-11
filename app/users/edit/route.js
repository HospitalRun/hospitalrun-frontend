import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditRoute.extend({
  editTitle: t('labels.editUser'),
  modelName: 'user',
  newTitle: t('labels.newUser'),

  getNewData: function() {
    return Ember.RSVP.resolve({
      roles: ['Data Entry', 'user']
    });
  }
});
