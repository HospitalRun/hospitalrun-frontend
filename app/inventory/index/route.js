import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractIndexRoute.extend(UserSession, {
    newButtonAction: function() {
        if (this.currentUserCan('add_inventory_request')) {
            return 'newRequest';
        } else {
            return null;
        }
    }.property(),
    newButtonText: '+ new request',
    pageTitle: 'Requests',

    actions: {
        fulfill: function(item) {
            item.set('dateCompleted', new Date());
            this.transitionTo('inventory.request', item);
        }
    },

    model: function() {
        return this.store.find('inv-request', {status:'Requested'});
    },
});