import Ember from "ember";
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
export default Ember.Route.extend(PouchDbMixin, ProgressDialog, Ember.SimpleAuth.AuthenticatedRouteMixin, {
    firstKey: null,
    hideNewButton: false,
    itemsPerPage: 25,
    modelName: null,
    newButtonAction: null,
    newButtonText: null,
    nextStartKey: null,
    pageTitle: null,
    
    keyPrefix: function() {
        var modelName = this.get('modelName');
        if (!Ember.isEmpty(modelName)) {
            return modelName + '_';
        }
    }.property('modelName'),
    
    _getStartKeyFromItem: function(item) {
        var modelName = this.get('modelName');
        return modelName+'_'+item.get('id');
    },
    
    _modelQueryParams: function() {
        return {};
    },
    
    model: function(params) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var modelName = this.get('modelName'),
                itemsPerPage = this.get('itemsPerPage'),
                queryParams = this._modelQueryParams(params);
            if (!Ember.isEmpty(params.sortKey)) {
                queryParams.sortKey = params.sortKey;
                if (!Ember.isEmpty(params.sortDesc)) {
                    queryParams.sortDesc = params.sortDesc;
                }                
            }
            if (Ember.isEmpty(queryParams.options)) {
                queryParams.options = {};
            }
            queryParams.options.limit = itemsPerPage + 1;
            if (!Ember.isEmpty(params.startKey)) {
                queryParams.options.startkey = params.startKey;
            }
            this.store.find(modelName, queryParams).then(function(model) {
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
            }.bind(this), reject);
        }.bind(this));
    },
    
    queryParams: {
        sortDesc: {refreshModel: true},
        sortKey: {refreshModel: true},
        startKey: {refreshModel: true}
    },
    
    setupController: function(controller, model) {
        var props = this.getProperties('firstKey', 'nextStartKey');
        controller.setProperties(props);
        if (!Ember.isEmpty(model)) {
            controller.set('hasRecords', (model.get('length') > 0));
        }
        var sectionDetails = {
            currentScreenTitle: this.get('pageTitle')
        };
        if (this.get('hideNewButton')) {
            sectionDetails.newButtonAction = null;
        } else if (!Ember.isEmpty(this.get('newButtonAction'))) {
            sectionDetails.newButtonAction = this.get('newButtonAction');
        }
        if (!Ember.isEmpty(this.get('newButtonText'))) {
            sectionDetails.newButtonText = this.get('newButtonText');
        }
        this.send('setSectionHeader', sectionDetails);
        this.closeProgressModal();
        this._super(controller, model);
    }
});