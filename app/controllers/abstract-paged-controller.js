export default Ember.ArrayController.extend({
    allArrangedContent: [],
    offset: 0,
    limit: 10,

    arrangedContent: function() {
        var arrangedContent = this._super();
        this.set('allArrangedContent', arrangedContent);
        var limit = this.get('limit'),
            offset = this.get('offset');
        return arrangedContent.slice(offset, offset+limit);
    }.property('content.@each.lastModified', 'sortProperties.@each', 'offset', 'limit'),
    
    disablePreviousPage: function() {
        return (this.get('offset') === 0);
    }.property('offset'),
                                            
    disableNextPage: function() {
    var limit = this.get('limit'),
        length = this.get('model.length'),
        offset = this.get('offset');
        return ((offset+limit) >= length);
    }.property('offset','limit','model.length'),
    
    showPagination: function() {
        var length = this.get('model.length'),
            limit = this.get('limit');
        return (length > limit);            
    }.property('model.length'),

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