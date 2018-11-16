import { inject as service } from '@ember/service';
import { isEmpty, compare } from '@ember/utils';
import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import FilterList from 'hospitalrun/mixins/filter-list';
import UserSession from 'hospitalrun/mixins/user-session';

export default Component.extend(FilterList, UserSession, {
  editImagingAction: 'editImaging',
  editLabAction: 'editLab',
  editMedicationAction: 'editMedication',
  filterBy: null,
  filterValue: null,
  newImagingAction: 'newImaging',
  newLabAction: 'newLab',
  newMedicationAction: 'newMedication',
  showDeleteImagingAction: 'showDeleteImaging',
  showDeleteLabAction: 'showDeleteLab',
  showDeleteMedicationAction: 'showDeleteMedication',
  sortKey: null,
  sortDesc: false,

  orderTypeFilters: computed(function() {
    let intl = this.get('intl');
    return [
      intl.t('components.patientOrders.labels.imagingOrderType').toString(),
      intl.t('components.patientOrders.labels.labOrderType').toString(),
      intl.t('components.patientOrders.labels.medicationOrderType').toString()
    ];
  }),

  canAddImaging: computed(function() {
    return this.currentUserCan('add_imaging');
  }),

  canAddLab: computed(function() {
    return this.currentUserCan('add_lab');
  }),

  canAddMedication: computed(function() {
    return this.currentUserCan('add_medication');
  }),

  canDeleteImaging: computed(function() {
    return this.currentUserCan('delete_imaging');
  }),

  canDeleteLab: computed(function() {
    return this.currentUserCan('delete_lab');
  }),

  canDeleteMedication: computed(function() {
    return this.currentUserCan('delete_medication');
  }),

  filteredList: computed('orderList.[]', 'filterBy', 'filterValue', function() {
    let filterBy = this.get('filterBy');
    let filterValue = this.get('filterValue');
    let orderList = this.get('orderList');
    orderList = this.filterList(orderList, filterBy, filterValue);
    return orderList;
  }),

  orderList: computed('visit.imaging.[]', 'visit.labs.[]', 'visit.medication.[]', function() {
    let intl = this.get('intl');
    let imaging = this.get('visit.imaging');
    let labs = this.get('visit.labs');
    let medication = this.get('visit.medication');
    let orderList = new A();
    orderList.addObjects(imaging.map((item) => {
      item.set('orderType', intl.t('components.patientOrders.labels.imagingOrderType'));
      item.set('name', item.get('imagingType.name'));
      item.set('dateProcessed', item.get('imagingDate'));
      this._setPermissions(item, 'canAddImaging', 'canDeleteImaging');
      return item;
    }));
    orderList.addObjects(labs.map((item) => {
      item.set('orderType', intl.t('components.patientOrders.labels.labOrderType'));
      item.set('name', item.get('labType.name'));
      item.set('dateProcessed', item.get('labDate'));
      this._setPermissions(item, 'canAddLab', 'canDeleteLab');
      return item;
    }));
    orderList.addObjects(medication.map((item) => {
      item.set('orderType', intl.t('components.patientOrders.labels.medicationOrderType'));
      item.set('name', item.get('medicationName'));
      item.set('dateProcessed', item.get('prescriptionDate'));
      item.set('result', '');
      item.set('notes', item.get('prescription'));
      this._setPermissions(item, 'canAddMedication', 'canDeleteMedication');
      return item;
    }));
    return orderList;
  }),

  sortedOrders: computed('filteredList', 'sortKey', 'sortDesc', function() {
    let filteredList = this.get('filteredList');
    let sortDesc = this.get('sortDesc');
    let sortKey = this.get('sortKey');
    if (isEmpty(filteredList) || isEmpty(sortKey)) {
      return filteredList;
    }
    filteredList = filteredList.sort(function(a, b) {
      let compareA = a.get(sortKey);
      let compareB = b.get(sortKey);
      if (sortKey === 'orderType') {
        compareA = compareA.toString();
        compareB = compareB.toString();
      }
      if (sortDesc) {
        return compare(compareB, compareA);
      } else {
        return compare(compareA, compareB);
      }
    });
    return filteredList;
  }),

  intl: service(),
  visit: null,

  _setPermissions(item, editPerm, deletePerm) {
    if (item.get('canEdit')) {
      if (this.get(editPerm)) {
        item.set('canEdit', true);
      }
      if (this.get(deletePerm)) {
        item.set('canDelete', true);
      }
    }
  },

  actions: {
    filter(filterBy, filterValue) {
      this.setProperties({
        filterBy,
        filterValue
      });
    },

    newImaging() {
      this.sendAction('newImagingAction');
    },

    newLab() {
      this.sendAction('newLabAction');
    },

    newMedication() {
      this.sendAction('newMedicationAction');
    },

    editOrder(order) {
      let modelName = order.get('constructor.modelName').capitalize();
      this.sendAction(`edit${modelName}Action`, order);
    },

    showDeleteOrder(order) {
      let modelName = order.get('constructor.modelName').capitalize();
      this.sendAction(`showDelete${modelName}Action`, order);
    },

    sortByKey(sortBy, sortDesc) {
      this.setProperties({
        sortKey: sortBy,
        sortDesc
      });
    }
  }
});
