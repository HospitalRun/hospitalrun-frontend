/*import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractPagedController.extend(UserSession, {
    startKey: [],
    canAdd: function() {        
        return this.currentUserCan('add_incident_request');
    }.property(),    
    
    canFulfill: function() {
        return this.currentUserCan('fulfill_incident');
    }.property() 
});*/

import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
    addPermission: 'add_incident',
    deletePermission: 'delete_incident'
});