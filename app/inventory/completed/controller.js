export default Ember.ArrayController.extend({

    offset: 0,
    limit: 10,
    sortProperties: ['dateFulfilled'],
    // Sort in descending order
    sortAscending: false,
    
    arrangedContent: function() {
        var arrangedContent = this._super();
        var limit = this.get('limit'),
            offset = this.get('offset');
        return arrangedContent.slice(offset, offset+limit);
    }.property('model', 'offset', 'limit'),
    
    disablePreviousPage: function() {
        return (this.get('offset') === 0);
    }.property('offset'),
                                            
    disableNextPage: function() {
    var limit = this.get('limit'),
        length = this.get('model.length'),
        offset = this.get('offset');
        return ((offset+limit) >= length);
    }.property('offset','limit','model.length'),

    actions: {
        nextPage: function() {
            var limit = this.get('limit');
            this.incrementProperty('offset', limit);
        }, 
        previousPage: function() {
            var limit = this.get('limit');
            this.decrementProperty('offset', limit);    
        }
    }
});