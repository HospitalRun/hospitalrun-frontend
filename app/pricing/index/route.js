import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({
    category: null,
    modelName: 'pricing',
    pageTitle: 'All Pricing Items',    
        
    _getStartKeyFromItem: function(item) {
        var category = item.get('category'),
            keyPrefix = this.get('keyPrefix'),
            name = item.get('name'),
            type = item.get('type');
        return [category, name, type, keyPrefix+item.get('id')];        
    },
    
    _modelQueryParams: function() {
        var category = this.get('category'),
            keyPrefix = this.get('keyPrefix'),
            maxValue = this.get('maxValue'),
            queryParams = {
                mapReduce: 'pricing_by_category'
            };
        if (!Ember.isEmpty(category)) {
            queryParams.options = {
                startkey: [category, null, null, null],
                endkey: [category, {}, {}, keyPrefix+maxValue]
            };
        }
        return queryParams;
    }    
});