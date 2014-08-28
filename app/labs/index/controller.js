import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractPagedController.extend(UserSession, {
    canAdd: function() {        
        return this.currentUserCan('add_lab');
    }.property(),    
    
    canComplete: function() {
        return this.currentUserCan('complete_lab');
    }.property() 
});