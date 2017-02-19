import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import VisitStatus from 'hospitalrun/utils/visit-statuses';

const {
  isEmpty
} = Ember;

export default Ember.Mixin.create(PouchDbMixin, {
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

  checkoutVisit(visit, status) {
    visit.set('status', status);
    visit.set('endDate', new Date());
    return visit.save().then((savedVisit) => this.updatePatientVisitFlags(savedVisit).then(() => {
      let i18n = this.get('i18n');
      let patientDetails = { patientName: visit.get('patient.displayName') };
      let message, title;
      if (status === VisitStatus.CHECKED_OUT) {
        message =  i18n.t('visits.messages.checkedOut', patientDetails);
        title = i18n.t('visits.titles.checkedOut');
      } else {
        message =  i18n.t('visits.messages.discharged', patientDetails);
        title = i18n.t('visits.titles.discharged');
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
      return Ember.RSVP.resolve();
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
