import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';

const { PromiseArray } = DS;

export default Component.extend({
  patient: null,

  database: service(),
  store: service(),

  appointments: computed('patient', function() {
    let patient = get(this, 'patient');
    if (!isEmpty(patient)) {
      let database = get(this, 'database');
      let endDate = moment().add(10, 'years').toDate().getTime();
      let maxApptId = database.getMaxPouchId('appointment');
      let minApptId = database.getMinPouchId('appointment');
      let patientId = get(patient, 'id');
      let startDate = moment().toDate().getTime();
      let store = get(this, 'store');
      let appointmentPromise = store.query('appointment', {
        options: {
          startkey: [patientId, startDate, startDate, minApptId],
          endkey: [patientId, endDate, endDate, maxApptId]
        },
        mapReduce: 'appointments_by_patient'
      });
      return PromiseArray.create({
        promise: appointmentPromise
      });
    }
  })
});
