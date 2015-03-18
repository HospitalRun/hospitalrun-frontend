/*import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractIndexRoute.extend(UserSession, {
    modelName: 'incident',
    newButtonAction: function() {
        if (this.currentUserCan('add_incident_request')) {
            return 'newRequest';
        } else {
            return null;
        }
    }.property(),
    newButtonText: '+ new Incident',
    pageTitle: 'Incidents',
    
    /*_getStartKeyFromItem: function(item) {
        return ['Requested',,'incident_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var maxValue = this.get('maxValue');
        return {
            options: {
                startkey: ['Requested', null, null],
                endkey: ['Requested', maxValue, maxValue]
            },
            mapReduce: 'inventory_request_by_status'
        };
    }, 
    actions: {
        fulfill: function(item) {
            item.set('dateCompleted', new Date());
            this.transitionTo('inventory.request', item);
        }
    }
});*/
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    modelName: 'incident',
    pageTitle: 'Incidents'    
});