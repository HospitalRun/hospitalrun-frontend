import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
  visitsController: Ember.inject.controller('visits'),

  lookupListsToUpdate: [],

  editController: Ember.inject.controller('visits/edit'),
  newReport: false,

  title: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('reports.titles.add');
    }
    return this.get('i18n').t('reports.titles.edit');
  }.property('model.isNew'),

  updateCapability: 'add_report',

  actions: {

  },

  beforeUpdate() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        if (this.get('model.isNew')) {
          this.addChildToVisit(this.get('model'), 'reports').then(resolve, reject);
        } else {
          resolve();
        }

    }.bind(this));
  },

  afterUpdate() {
    let alertTitle = this.get('i18n').t('reports.titles.saved');
    let alertMessage = this.get('i18n').t('reports.messages.saved');
    this.saveVisitIfNeeded(alertTitle, alertMessage);
  }
});
