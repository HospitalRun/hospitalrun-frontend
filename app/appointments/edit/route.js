import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import Ember from 'ember';
import moment from 'moment';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import { translationMacro as t } from 'ember-i18n';

const {
  get,
  isEmpty,
  RSVP: {
    resolve
  }
} = Ember;

export default AbstractEditRoute.extend(AddToPatientRoute, PatientListRoute, {
  editTitle: t('appointments.editTitle'),
  modelName: 'appointment',
  newButtonText: t('appointments.buttons.newButton'),

  newTitle: t('appointments.newTitle'),

  getNewData(params) {
    let idParam = get(this, 'idParam');
    let newData = {
      appointmentType: 'Admission',
      allDay: true,
      selectPatient: true,
      startDate: new Date()
    };
    if (!isEmpty(idParam) && params[idParam] === 'newsurgery') {
      newData.appointmentType = 'Surgery';
      newData.allDay = false;
      newData.endDate = moment().add('1', 'hours').toDate();
      newData.returnTo = 'appointments.theater';
    }
    return resolve(newData);
  },

  getScreenTitle(model) {
    let appointmentType = get(model, 'appointmentType');
    if (appointmentType === 'Surgery') {
      let i18n = get(this, 'i18n');
      let isNew = get(model, 'isNew');
      if (isNew) {
        return i18n.t('appointments.titles.newSurgicalAppointment');
      } else {
        return i18n.t('appointments.titles.editSurgicalAppointment');
      }
    } else {
      return this._super(model);
    }
  },

  model(params) {
    let idParam = this.get('idParam');
    let modelId = params[idParam];
    if (!isEmpty(idParam) && (modelId.indexOf('new') === 0)) {
      if (!isEmpty(params.forPatientId)) {
        let modelPromise = this._super(params);
        return this._setPatientOnModel(modelPromise, params.forPatientId);
      } else {
        return this._createNewRecord(params);
      }
    } else {
      return this._super(params);
    }
  }

});
