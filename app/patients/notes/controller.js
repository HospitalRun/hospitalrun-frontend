import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditController.extend(IsUpdateDisabled, UserSession, PatientSubmodule, PatientNotes, {
  cancelAction: 'closeModal',
  updateAction: 'updateNote',
  moduleController: Ember.inject.controller('patients'),
  physicianList: Ember.computed.alias('moduleController.physicianList'),
  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.attribution',
    id: 'physician_list'
  }],
  title: function() {
    if (this.get('model.isNew')) {
      return `${this.get('i18n').t('patients.notes.new_note')} ${this.get('model.patient.displayName')}`;
    } else {
      return `${this.get('i18n').t('patients.notes.new_note')} ${(moment(this.get('model.date')).format('MM/DD/YYYY')) + ' for ' + this.get('model.patient.displayName')}`;
    }
  }.property('model.patient.displayName'),
  updateCapability: 'add_note',
  beforeUpdate: function() {
    this.set('model.date', new Date());
    this.set('model.createdBy', this.getUserName());
    return Ember.RSVP.Promise.resolve();
  },
  afterUpdate: function() {
    this.send(this.get('updateAction'), this.get('model'));
    this.send(this.get('cancelAction'));
  },
  actions: {
    changeVisit: function() {
      const selectEl = $('select[name="note-visits"]')[0];
      const selectedIndex = selectEl.selectedIndex;
      const content = this.get('patientVisitsForSelect');

      // decrement index by 1 if we have a prompt
      const contentIndex = selectedIndex - 1;

      const selection = content[contentIndex].selectObject;

      // set the local, shadowed selection to avoid leaking
      // changes to `selection` out via 2-way binding
      this.get('model').set('visit', selection);
      this._setNoteType();
    }
  }
});
