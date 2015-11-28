import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import PatientNoteTypes from 'hospitalrun/mixins/patient-note-types';
import SelectValues from 'hospitalrun/utils/select-values';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditController.extend(IsUpdateDisabled, PatientNoteTypes, UserSession, {
  cancelAction: 'closeModal',
  patientsController: Ember.inject.controller('patients'),
  patientsEdit: Ember.inject.controller('patients/edit'),
  physicianList: Ember.computed.map('patientsController.physicianList.value', SelectValues.selectValuesMap),
  title: function() {
    if (this.get('model.isNew')) {
      return 'New Note for ' + this.get('model.patient.displayName');
    } else {
      return 'Updating Note from '+(moment(this.get('model.date')).format('MM/DD/YYYY'))+' for ' + this.get('model.patient.displayName');
    }    
  }.property('model.patient.displayName'),
  updateCapability: 'add_note',
  beforeUpdate: function() {
    this.set('model.date', new Date());
    this.set('model.createdBy', this.getUserName());
    return Ember.RSVP.Promise.resolve();
  },
  afterUpdate: function() {
    this.get('patientsEdit').send('updateNote', this.get('model'));
    this.send(this.get('cancelAction'));
  }
});