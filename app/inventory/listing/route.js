import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractIndexRoute.extend(UserSession, {
    newButtonAction: function() {
        if (this.currentUserCan('add_inventory_item')) {
            return 'newItem';
        } else {
            return null;
        }
    }.property(),    
    newButtonText: '+ new item',
    pageTitle: 'Items'
});