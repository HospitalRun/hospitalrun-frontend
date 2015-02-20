import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.ArrayController.extend(UserSession, {
    addPermission: null,
    deletePermission: null,
    nextStartKey: null,
    previousStartKey: null,
    previousStartKeys: [],
    queryParams: ['startKey'],
    
    canAdd: function() {        
        return this.currentUserCan(this.get('addPermission'));
    }.property(),    
    
    canDelete: function() {
        return this.currentUserCan(this.get('deletePermission'));
    }.property(),
    
    canEdit: function() {
        //Default to using add permission
        return this.currentUserCan(this.get('addPermission'));
    }.property(),    
    
    showActions: function() {
        return (this.get('canAdd') || this.get('canEdit') || this.get('canDelete'));
    }.property('canAdd', 'canEdit', 'canDelete'),
    
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