import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({
    category: null,
    modelName: 'pricing',
    pageTitle: 'All Pricing Items',    
        
    _getStartKeyFromItem: function(item) {
        var category = this.get('category'),
            keyPrefix = this.get('keyPrefix');        
        if (Ember.isEmpty(category)) {
            return this._super(item);
        } else {
            return [category, keyPrefix+item.get('id')];
        }
    },
    
    _modelQueryParams: function() {
        var category = this.get('category'),
            keyPrefix = this.get('keyPrefix'),
            maxValue = this.get('maxValue');
        if (Ember.isEmpty(category)) {
            return this._super();
        } else {
            return {
                options: {
                    startkey: [category, keyPrefix],
                    endkey: [category, keyPrefix+maxValue]
                },
                mapReduce: 'pricing_by_category'
            };
        }
    }    
});