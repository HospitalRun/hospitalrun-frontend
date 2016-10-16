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
      return `${this.get('i18n').t('patients.notes.newNote')} ${this.get('model.patient.displayName')}`;
    } else {
      return `${this.get('i18n').t('patients.notes.newNote')} ${moment(this.get('model.date')).format('MM/DD/YYYY')} for ${this.get('model.patient.displayName')}`;
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
      let selectEl = $('select[name="note-visits"]')[0];
      let selectedIndex = selectEl.selectedIndex;
      let content = this.get('patientVisitsForSelect');

      // decrement index by 1 if we have a prompt
      let contentIndex = selectedIndex - 1;

      let selection = content[contentIndex].selectObject;

      // set the local, shadowed selection to avoid leaking
      // changes to `selection` out via 2-way binding
      this.get('model').set('visit', selection);
      this._setNoteType();
    }
  }
});
