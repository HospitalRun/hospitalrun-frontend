import Ember from "ember";
export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    searchKeys: null,
    searchModel: null,
    searchText: null,
    
    _findBySearchIndex: function(searchText) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var searchIndex = this.get('searchIndex'),
                searchModel = this.get('searchModel');
            if (Ember.isEmpty(searchIndex)) {
                //Search index not defined, so reject
                reject();
            } else {
                var searchParams = Ember.copy(searchIndex);
                searchParams.query = searchText;
                this.store.find(searchModel, {                    
                    searchIndex: searchParams
                }).then(function(results) {
                    if (Ember.isEmpty(results)) {
                        reject();
                    } else {
                        resolve(results);
                    }
                }, reject);            
            }
        }.bind(this));
    },
    
    _findByContains: function(searchText) {
        var searchKeys = this.get('searchKeys'),
            searchModel = this.get('searchModel'),
            queryParams = {
                containsValue: {
                    value: searchText,
                    keys: searchKeys                            
                }
            };
        return this.store.find(searchModel, queryParams);
    },
    
    /**
     * Search using the following strategy:
     * 1) Search by id; if that fails to yield a result,:
     * 2) Search by search index if it is defined.  Search indexes are used by PouchDB Quick Search for fast search results
     * 3) If search index doesn't exist or if search by index doesn't yield a result, do a contains search which ends
     * up using a mapreduce function which loops through all the records in PouchDB (very slow).
     */
    model: function(params) {
        return new Ember.RSVP.Promise(function(resolve) {
            var searchText = params.search_text;
            this.controllerFor('navigation').set('currentSearchText', searchText);
            this.set('searchText', searchText);
            //First search by id
            this.store.find(this.searchModel, searchText).then(function(results) {
               resolve([results]);
            }, function() {
                this._findBySearchIndex(searchText).then(resolve, function() {
                    this._findByContains(searchText).then(resolve, function(err) {
                        resolve();
                        throw new Error(err);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },    
    
    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('hasRecords', (model.get('length') > 0));
        controller.set('searchText', this.get('searchText'));
        this.controllerFor('navigation').closeProgressModal();
        var parentController = this.controllerFor(this.get('moduleName'));
        var searchTitle = 'Search Results for <i>'+this.get('searchText')+'</i>';
        parentController.set('currentScreenTitle', searchTitle.htmlSafe());
    }    
    
});
