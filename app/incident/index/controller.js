import { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import FilterList from 'hospitalrun/mixins/filter-list';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractPagedController.extend(FilterList, UserSession, {
  addPermission: 'add_incident',
  deletePermission: 'delete_incident',
  startKey: [],

  incidentController: controller('incident'),
  departmentNames: alias('incidentController.incidentDepartmentList.value'),

  categoryItems: computed('model.@each.categoryItem', function() {
    return this._getUniqueValues('categoryItem');
  }),

  categoryNames: computed('model.@each.categoryName', function() {
    return this._getUniqueValues('categoryName');
  }),

  statusList: computed('model.@each.localizedStatus', function() {
    return this._getUniqueValues('localizedStatus');
  }),

  filteredIncidents: computed('model.[]', 'filterBy', 'filterValue', function() {
    let filterBy = get(this, 'filterBy');
    let filterValue = get(this, 'filterValue');
    let incidents = get(this, 'model');
    return this.filterList(incidents, filterBy, filterValue);
  }),

  sortedIncidents: computed('filteredIncidents', 'sortByKey', 'sortByDesc', function() {
    let filteredList = get(this, 'filteredIncidents');
    return this.sortFilteredList(filteredList);
  }),

  _getUniqueValues(attribute) {
    let uniqueValues = get(this, 'model').map((incident) => get(incident, attribute)).uniq();
    return uniqueValues.filter((value) => !isEmpty(value));
  },

  actions: {
    showDeleteIncident(incident) {
      this.send('openModal', 'incident.delete', incident);
    }
  }
});
