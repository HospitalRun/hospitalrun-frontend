import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractPagedController.extend(UserSession, {    
    canAdd: function() {        
        return this.currentUserCan('add_invoice');
    }.property(),    
    
    canDelete: function() {
        return this.currentUserCan('delete_invoice');
    }.property(),
    
    showActions: function() {
        return (this.get('canAdd') || this.get('canDelete'));
    }.property('canAdd', 'canDelete')
});