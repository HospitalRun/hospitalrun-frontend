import Ember from "ember";
export default Ember.ArrayController.extend({
    nextStartKey: null,
    previousStartKey: null,
    previousStartKeys: [],
    queryParams: ['startKey'],
    limit: 10,
    
    disablePreviousPage: function() {
        return (Ember.isEmpty(this.get('previousStartKey')));
    }.property('previousStartKey'),
    
    disableNextPage: function() {
        return (Ember.isEmpty(this.get('nextStartKey')));
    }.property('nextStartKey'),
    
    showPagination: function() {
        return (!Ember.isEmpty(this.get('previousStartKey') || !Ember.isEmpty(this.get('nextStartKey'))));
    }.property('nextStartKey', 'previousStartKey'),
    
    actions: {
        nextPage: function() {            
            var key = this.get('nextStartKey'),
                previousStartKeys = this.get('previousStartKeys'),
                firstKey = this.get('firstKey');
            this.set('previousStartKey', firstKey);
            previousStartKeys.push(firstKey);
            this.set('startKey',key);
        },
        previousPage: function() {
            var key = this.get('previousStartKey'),
                previousStartKeys = this.get('previousStartKeys');
            previousStartKeys.pop();
            this.set('startKey',key);
            this.set('previousStartKey', previousStartKeys.pop());
            this.set('previousStartKeys', previousStartKeys);
            
        }
    }
});