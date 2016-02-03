import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import SelectValues from 'utils/select-values';

export default AbstractEditController.extend(SelectValues, {
  cancelAction: 'closeModal',

  editController: Ember.inject.controller('incident/edit'),

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

  newInvestigationFinding: false,

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Investigation Finding';
    }
    return 'Edit Investigation Finding';
  }.property('model.isNew'),

  updateCapability: 'add_investigation_finding',

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
