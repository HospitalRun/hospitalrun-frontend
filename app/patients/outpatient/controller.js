import Ember from 'ember';
import FilterList from 'hospitalrun/mixins/filter-list';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import UserSession from 'hospitalrun/mixins/user-session';
import VisitTypes from 'hospitalrun/mixins/visit-types';

const { computed } = Ember;

export default Ember.Controller.extend(FilterList, PatientVisits,  UserSession, VisitTypes, {
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

  filteredVisits: computed('model', 'filterBy', 'filterValue', function() {
    let filterBy = this.get('filterBy');
    let filterValue = this.get('filterValue');
    let visits = this.get('model');
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
    editVisit(visit) {
      if (this.get('canAddVisit')) {
        visit.set('returnToOutPatient', true);
        this.transitionToRoute('visits.edit', visit);
      }
    },

    filter(filterBy, filterValue) {
      this.set('filterBy', filterBy);
      this.set('filterValue', filterValue);
    },

    sortByKey(sortKey, sortDesc) {
      this.setProperties({
        sortByDesc: sortDesc,
        sortByKey: sortKey
      });
    },

    patientCheckIn() {
      this.transitionToRoute('visits.edit', 'checkin');
    }

  }
});
