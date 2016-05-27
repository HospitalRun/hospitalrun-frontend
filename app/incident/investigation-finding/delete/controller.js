import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyInvestigationFindingDelete',
  editController: Ember.inject.controller('incident/edit'),

  title: t('incident.titles.delete_finding'),

  actions: {
    notifyInvestigationFindingDelete: function() {
      this.get('editController').send('deleteInvestigationFinding', this.get('model'));
      this.send('closeModal');
    }
  }
});
