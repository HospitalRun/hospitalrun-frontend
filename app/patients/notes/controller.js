import { Promise as EmberPromise } from 'rsvp';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import moment from 'moment';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditController.extend(IsUpdateDisabled, UserSession, PatientSubmodule, PatientNotes, {
  cancelAction: 'closeModal',
  updateAction: 'updateNote',
  moduleController: controller('patients'),
  applicationController: controller('application'),
  physicianList: alias('moduleController.physicianList'),
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
  showSelectVisit: computed('applicationController.currentPath', function() {
    return (this.get('applicationController.currentPath') == 'patients.edit');
  }),
  updateCapability: 'add_note',
  beforeUpdate() {
    this._setNoteType();
    this.set('model.date', new Date());
    this.set('model.createdBy', this.getUserName());
    return EmberPromise.resolve();
  },
  afterUpdate() {
    this.send(this.get('updateAction'), this.get('model'));
    this.send(this.get('cancelAction'));
  }
});
