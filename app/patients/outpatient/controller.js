import Ember from 'ember';
import FilterList from 'hospitalrun/mixins/filter-list';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitTypes from 'hospitalrun/mixins/visit-types';

const { computed } = Ember;

export default Ember.Controller.extend(FilterList, ModalHelper, PatientVisits,  UserSession, VisitTypes, {
  addPermission: 'add_patient',
  deletePermission: 'delete_patient',
  filterValue: null,
  filterBy: null,
  sortByDesc: null,
  sortByKey: null,
  canAddVisit: computed(function() {
    return this.currentUserCan('add_visit');
  }),
  hasAppointmentLabels: computed(function() {
    let i18n = this.get('i18n');
    return [
      i18n.t('visits.labels.haveAppointment'),
      i18n.t('visits.labels.noAppointment')
    ];
  }),
  doneOrdersValues: computed(function() {
    let i18n = this.get('i18n');
    return [
      i18n.t('visits.labels.ordersNotDone'),
      i18n.t('visits.labels.haveDoneOrders')
    ];
  }),
  patientNames: computed.map('model', function(visit) {
    return visit.get('patient.shortDisplayName');
  }),
  patientController: Ember.inject.controller('patients'),
  sexList: computed.alias('patientController.sexList.value'),
  visitTypesList: computed.alias('patientController.visitTypesList'),
  visitTypesValues: computed.map('visitTypes', function(visitType) {
    return visitType.value;
  }),

  checkedInVisits: computed.filter('model.@each.status', function(visit) {
    return visit.get('status') !== 'checkedOut';
  }),

  filteredVisits: computed('checkedInVisits', 'filterBy', 'filterValue', function() {
    let filterBy = this.get('filterBy');
    let filterValue = this.get('filterValue');
    let visits = this.get('checkedInVisits');
    return this.filterList(visits, filterBy, filterValue);
  }),

  sortedVisits: computed('filteredVisits', 'sortByKey', 'sortByDesc', function() {
    let filteredList = this.get('filteredVisits');
    let sortDesc = this.get('sortByDesc');
    let sortBy = this.get('sortByKey');
    if (Ember.isEmpty(filteredList) || Ember.isEmpty(sortBy)) {
      return filteredList;
    }
    filteredList = filteredList.toArray().sort(function(a, b) {
      let compareA = a.get(sortBy);
      let compareB = b.get(sortBy);
      if (sortBy === 'orderType') {
        compareA = compareA.toString();
        compareB = compareB.toString();
      }
      if (sortDesc) {
        return Ember.compare(compareB, compareA);
      } else {
        return Ember.compare(compareA, compareB);
      }
    });
    return filteredList;
  }),

  startKey: [],
  actions: {
    checkOut(visit) {
      let i18n = this.get('i18n');
      let patientDetails = { patientName: visit.get('patient.displayName') };
      let confirmMessage =  i18n.t('visits.messages.checkOut', patientDetails);
      this.displayConfirm(i18n.t('visits.titles.checkOut'), confirmMessage,
          'finishCheckOut', visit);
    },

    editVisit(visit) {
      if (this.get('canAddVisit')) {
        visit.set('returnTo', 'patients.outpatient');
        this.transitionToRoute('visits.edit', visit);
      }
    },

    filter(filterBy, filterValue) {
      this.set('filterBy', filterBy);
      this.set('filterValue', filterValue);
    },

    finishCheckOut(visit) {
      visit.set('status', 'checkedOut');
      visit.save().then(() => {
        let i18n = this.get('i18n');
        let patientDetails = { patientName: visit.get('patient.displayName') };
        let message =  i18n.t('visits.messages.checkedOut', patientDetails);
        this.displayAlert(i18n.t('visits.titles.checkedOut'), message);
      });
    },

    sortByKey(sortKey, sortDesc) {
      this.setProperties({
        sortByDesc: sortDesc,
        sortByKey: sortKey
      });
    },

    patientCheckIn() {
      this.transitionToRoute('visits.edit', 'checkin').then(function(newRoute) {
        let visitProps = {
          outPatient: true,
          returnTo: 'patients.outpatient'
        };
        newRoute.currentModel.setProperties(visitProps);
      });
    }

  }
});
