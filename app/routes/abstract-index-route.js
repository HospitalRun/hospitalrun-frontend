import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';

const { isEmpty } = Ember;

export default Ember.Route.extend(PouchDbMixin, ProgressDialog, AuthenticatedRouteMixin, {
  database: Ember.inject.service(),
  filterParams: null,
  firstKey: null,
  hideNewButton: false,
  itemsPerPage: 25,
  modelName: null,
  newButtonAction: null,
  newButtonText: null,
  nextStartKey: null,
  pageTitle: null,

  _getFilterParams(params) {
    let filterByList = [];
    let filterParams = this.get('filterParams');
    if (!isEmpty(filterParams)) {
      filterParams.forEach(function(paramName) {
        if (!isEmpty(params[paramName])) {
          filterByList.push({
            name: paramName,
            value: params[paramName]
          });
        }
      });
    }
    return filterByList;
  },

  _getMaxPouchId() {
    return this.get('database').getMaxPouchId(this.get('modelName').camelize());
  },

  _getMinPouchId() {
    return this.get('database').getMinPouchId(this.get('modelName').camelize());
  },

  _getPouchIdFromItem(item) {
    return this.get('database').getPouchId(item.get('id'), this.get('modelName').camelize());
  },

  _getStartKeyFromItem(item) {
    return item.get('id');
  },

  _modelQueryParams() {
    return {};
  },

  model(params) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let filterParams = this._getFilterParams(params);
      let modelName = this.get('modelName');
      let itemsPerPage = this.get('itemsPerPage');
      let queryParams = this._modelQueryParams(params);
      if (!isEmpty(params.sortKey)) {
        queryParams.sortKey = params.sortKey;
        if (!isEmpty(params.sortDesc)) {
          queryParams.sortDesc = params.sortDesc;
        }
      }
      if (!isEmpty(filterParams)) {
        queryParams.filterBy = filterParams;
      }
      if (isEmpty(queryParams.options)) {
        queryParams.options = {};
      }
      if (!isEmpty(itemsPerPage)) {
        queryParams.options.limit = itemsPerPage + 1;
      }
      if (!isEmpty(params.startKey)) {
        queryParams.options.startkey = params.startKey;
      }
      this.store.query(modelName, queryParams).then(function(model) {
        if (!isEmpty(itemsPerPage)) {
          if (model.get('length') > 0) {
            this.set('firstKey', this._getStartKeyFromItem(model.get('firstObject')));
          }
          if (model.get('length') > itemsPerPage) {
            let lastItem = model.popObject();
            this.set('nextStartKey', this._getStartKeyFromItem(lastItem));
          } else {
            this.set('nextStartKey');
          }
        }
        resolve(model);
      }.bind(this), reject);
    }.bind(this));
  },

  queryParams: {
    sortDesc: { refreshModel: true },
    sortKey: { refreshModel: true },
    startKey: { refreshModel: true }
  },

  setupController(controller, model) {
    let props = this.getProperties('firstKey', 'nextStartKey');
    controller.setProperties(props);
    let sectionDetails = {
      currentScreenTitle: this.get('pageTitle')
    };
    if (this.get('hideNewButton')) {
      sectionDetails.newButtonAction = null;
    } else if (!isEmpty(this.get('newButtonAction'))) {
      sectionDetails.newButtonAction = this.get('newButtonAction');
    }
    if (!isEmpty(this.get('newButtonText'))) {
      sectionDetails.newButtonText = this.get('newButtonText');
    }
    this.send('setSectionHeader', sectionDetails);
    this.closeProgressModal();
    this._super(controller, model);
  }
});
