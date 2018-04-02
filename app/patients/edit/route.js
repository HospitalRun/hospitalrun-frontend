import { isEmpty } from '@ember/utils';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import PatientNotes from 'hospitalrun/mixins/patient-notes';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend(PatientVisits, PouchDbMixin, PatientNotes, {
  customForms: service(),
  editTitle: t('patients.titles.edit'),
  modelName: 'patient',
  newTitle: t('patients.titles.new'),
  photos: null,

  actions: {
    updateNote(note) {
      note.get('visit').save().then(function() {
        // noop
      });
    },
    appointmentDeleted(model) {
      this.controller.send('appointmentDeleted', model);
    },
    returnToPatient() {
      this.controller.send('returnToPatient');
    },
    deleteContact(model) {
      this.controller.send('deleteContact', model);
    },

    deleteExpense(model) {
      this.controller.send('deleteExpense', model);
    },

    deleteFamily(model) {
      this.controller.send('deleteFamily', model);
    },

    deletePhoto(model) {
      this.controller.send('deletePhoto', model);
    },

    updateExpense(model) {
      this.controller.send('updateExpense', model);
    },

    updateFamilyInfo(model) {
      this.controller.send('updateFamilyInfo', model);
    },

    visitDeleted(model) {
      this.controller.send('visitDeleted', model);
    }
  },

  getNewData() {
    let customForms = this.get('customForms');
    let newPatientData = {
      customForms: EmberObject.create()
    };
    return customForms.setDefaultCustomForms(['patient', 'socialwork'], newPatientData);
  },

  setupController(controller, model) {
    // Load appointments, photos and visits asynchronously.
    let friendlyId = model.get('friendlyId');
    let externalId = model.get('externalPatientId');
    let maxValue = this.get('maxValue');
    let patientId = model.get('id');
    if (isEmpty(friendlyId) && !isEmpty(externalId)) {
      model.set('friendlyId', externalId);
    }
    this._super(controller, model);
    this.getPatientVisits(model).then(function(visits) {
      model.set('visits', visits);
    });
    this.store.query('appointment', {
      options: {
        startkey: [patientId, null, null, 'appointment_'],
        endkey: [patientId, maxValue, maxValue, maxValue]
      },
      mapReduce: 'appointments_by_patient'
    }).then(function(appointments) {
      model.set('appointments', appointments);
    });
    this.store.query('photo', {
      options: {
        key: patientId
      },
      mapReduce: 'photo_by_patient'
    }).then(function(photos) {
      let patientPhotos = [];
      patientPhotos.addObjects(photos);
      model.set('photos', patientPhotos);
    });
  }

});
