import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

export default AbstractEditController.extend(SelectValues, {
  cancelAction: 'closeModal',
  updateCapability: 'add_investigation_finding',

  editController: Ember.inject.controller('incident/edit'),

  newInvestigationFinding: false,

  typeOfPersonInvolved: [
    'Patient',
    'Staff',
    'Visitor'
  ].map(SelectValues.selectValuesMap),

  identityDocumentTypes: [
    'Employee Number',
    'ID Card',
    'Passport',
    'Medical Record Number',
    'Driving License Number',
    'Mobile Number'
  ].map(SelectValues.selectValuesMap),

  title: function() {
    var i18n = this.get('i18n');
    var isNew = this.get('model.isNew');
    if (isNew) {
      return i18n.t('incident.titles.addFinding');
    }
    return i18n.t('incident.titles.editFinding');
  }.property('model.isNew'),

  beforeUpdate: function() {
    if (this.get('model.isNew')) {
      this.set('newInvestigationFinding', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function(investigationFinding) {
    if (this.get('newInvestigationFinding')) {
      this.get('editController').send('addInvestigationFinding', investigationFinding);
    } else {
      this.send('closeModal');
    }
  }
});
