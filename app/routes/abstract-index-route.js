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

  queryParams: {
    sortDesc: { refreshModel: true },
    sortKey: { refreshModel: true },
    startKey: { refreshModel: true }
  },

  _getFilterParams(params) {
    var filterByList = [],
      filterParams = this.get('filterParams');
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
    return this.get('database').getPouchId({}, this.get('modelName').camelize());
  },

  _getMinPouchId() {
    return this.get('database').getPouchId(null, this.get('modelName').camelize());
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

  buildQueryParams(params) {
    var filterParams = this._getFilterParams(params),
      itemsPerPage = this.get('itemsPerPage'),
      queryParams = this._modelQueryParams(params);
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
    queryParams.options.limit = itemsPerPage + 1;
    if (!isEmpty(params.startKey)) {
      queryParams.options.startkey = params.startKey;
    }
    return queryParams;
  },

  model(params) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let modelName = this.get('modelName'),
      queryParams = this.buildQueryParams(params),
      itemsPerPage = this.get('itemsPerPage');
      this.store.query(modelName, queryParams).then((model) => {
        if (model.get('length') > 0) {
          this.set('firstKey', this._getStartKeyFromItem(model.get('firstObject')));
        }
        if (model.get('length') > itemsPerPage) {
          var lastItem = model.popObject();
          this.set('nextStartKey', this._getStartKeyFromItem(lastItem));
        } else {
          this.set('nextStartKey');
        }
        resolve(model);
      }, reject);
    });
  },

  setupController(controller, model) {
    var props = this.getProperties('firstKey', 'nextStartKey');
    controller.setProperties(props);
    var sectionDetails = {
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
