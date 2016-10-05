import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import Ember from 'ember';
import FilterList from 'hospitalrun/mixins/filter-list';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import VisitTypes from 'hospitalrun/mixins/visit-types';
export default AbstractPagedController.extend(FilterList, PatientVisits, VisitTypes, {
  addPermission: 'add_patient',
  deletePermission: 'delete_patient',
  filterValue: null,
  filterBy: null,
  queryParams: null,
  canAddVisit: function() {
    return this.currentUserCan('add_visit');
  }.property(),

  firstNames:  Ember.computed.map('model', function(visit) {
    return visit.get('patient.firstName');
  }),
  lastNames:  Ember.computed.map('model', function(visit) {
    return visit.get('patient.lastName');
  }),
  patientController: Ember.inject.controller('patients'),
  sexList: Ember.computed.alias('patientController.sexList.value'),
  visitTypesList: Ember.computed.alias('patientController.visitTypesList'),
  visitTypesValues: Ember.computed.map('visitTypes', function(visitType) {
    return visitType.value;
  }),
  filteredVisits: Ember.computed('model', 'filterBy', 'filterValue', function() {
    let filterBy = this.get('filterBy');
    let filterValue = this.get('filterValue');
    let visits = this.get('model');
    return this.filterList(visits , filterBy, filterValue);
  }),
  sortedVists: Ember.computed('filteredVisits', 'sortBy', 'sortDesc', function() {
    let filteredList = this.get('filteredVisits');
    let sortDesc = this.get('sortDesc');
    let sortBy = this.get('sortBy');
    if (Ember.isEmpty(filteredList) || Ember.isEmpty(sortBy)) {
      return filteredList;
    }
    filteredList = filteredList.sort(function(a, b) {
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
    this.set('sortKey', sortBy);
    return filteredList;
  }),

  startKey: [],
  actions: {
    editVisit: function(visit) {
      if (this.get('canAddVisit')) {
        this.transitionToRoute('visits.edit', visit);
      }
    },

    filter(filterBy, filterValue) {
      this.set('filterBy', filterBy);
      this.set('filterValue', filterValue);
    },

    sortByKey(sortKey, sortDesc) {
      this.setProperties({
        sortDesc: sortDesc,
        sortKey: sortKey
      });
    },

    patientCheckIn: function() {
      this.transitionToRoute('visits.edit', 'checkin');
    }

  }
});
