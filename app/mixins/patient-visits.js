import { resolve } from 'rsvp';
import Mixin from '@ember/object/mixin';
import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import VisitStatus from 'hospitalrun/utils/visit-statuses';
import DS from 'ember-data';
import moment from 'moment';

export default Mixin.create(PouchDbMixin, {
  getPatientVisits(patient) {
    let maxValue = this.get('maxValue');
    let patientId = patient.get('id');
    return this.store.query('visit', {
      options: {
        startkey: [patientId, null, null, null, 'visit_'],
        endkey: [patientId, maxValue, maxValue, maxValue, maxValue]
      },
      mapReduce: 'visit_by_patient',
      debug: true
    });
  },

  getPatientFutureAppointment(visit, outPatient) {
    let patientId = get(visit, 'patient.id');
    let visitDate = get(visit, 'startDate');
    let maxValue = get(this, 'maxValue');
    let promise = this.store.query('appointment', {
      options: {
        startkey: [patientId, null, null, 'appointment_'],
        endkey: [patientId, maxValue, maxValue, maxValue]
      },
      mapReduce: 'appointments_by_patient'
    }).then(function(result) {
      let futureAppointments = result.filter(function(data) {
        let startDate = get(data, 'startDate');
        return startDate && moment(startDate).isAfter(moment(visitDate), 'day');
      }).sortBy('startDate');
      if (!futureAppointments.length) {
        return null;
      }
      if (!outPatient) {
        let [appointment] = futureAppointments;
        return appointment;
      } else {
        return futureAppointments.slice(0, 3);
      }

    });
    return (outPatient) ? DS.PromiseArray.create({ promise }) : DS.PromiseObject.create({ promise });
  },

  _getVisitCollection(visits, name) {
    let returnList = [];
    if (!isEmpty(visits)) {
      visits.forEach(function(visit) {
        get(visit, name).then(function(items) {
          returnList.addObjects(items);
        });
      });
    }
    return returnList;
  },

  _getPatientProcedures(operationReports, visits) {
    let patientProcedures = this._getVisitCollection(visits, 'procedures');
    operationReports.forEach((report) => {
      let reportedProcedures = get(report, 'procedures');
      let surgeryDate = get(report, 'surgeryDate');
      reportedProcedures.forEach((procedure) => {
        patientProcedures.addObject({
          description: get(procedure, 'description'),
          procedureDate: surgeryDate,
          report
        });
      });
    });
    return patientProcedures;
  },

  checkoutVisit(visit, status) {
    visit.set('status', status);
    visit.set('endDate', new Date());
    return visit.save().then((savedVisit) => this.updatePatientVisitFlags(savedVisit).then(() => {
      let intl = this.get('intl');
      let patientDetails = { patientName: visit.get('patient.displayName') };
      let message, title;
      if (status === VisitStatus.CHECKED_OUT) {
        message =  intl.t('visits.messages.checkedOut', patientDetails);
        title = intl.t('visits.titles.checkedOut');
      } else {
        message =  intl.t('visits.messages.discharged', patientDetails);
        title = intl.t('visits.titles.discharged');
      }
      this.displayAlert(title, message);
    }));
  },

  updatePatientVisitFlags(visit) {
    let patient = visit.get('patient');
    let patientAdmitted = patient.get('admitted');
    let patientCheckedIn = patient.get('checkedIn');
    let status = this.get('model.status');
    if (status === VisitStatus.ADMITTED && !patientAdmitted) {
      patient.set('admitted', true);
      return patient.save();
    } else if (status === VisitStatus.CHECKED_IN && !patientCheckedIn) {
      patient.set('checkedIn', true);
      return patient.save();
    } else if (status === VisitStatus.CHECKED_OUT && patientCheckedIn) {
      return this._updateUnlessVisitStatusExists(patient, VisitStatus.CHECKED_IN, 'checkedIn');
    } else if (status === VisitStatus.DISCHARGED && patientAdmitted) {
      return this._updateUnlessVisitStatusExists(patient, VisitStatus.ADMITTED, 'admitted');
    } else {
      return resolve();
    }
  },

  _updateUnlessVisitStatusExists(patient, statusToLookFor, patientStatusToSet) {
    return this.getPatientVisits(patient).then((visits) => {
      if (isEmpty(visits.findBy('status', statusToLookFor))) {
        patient.set(patientStatusToSet, false);
        return patient.save();
      }
    });
  }

});
