import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractIndexRoute.extend(UserSession, {
    modelName: 'incident',
    pageTitle: 'Incidents',
    
    _getStartKeyFromItem: function(item) {        
        return [item.get('reportedBy'),'incident_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var maxValue = this.get('maxValue'),
            currentUser = this.getCurrentUserName(),
            queryParams = {
                mapReduce: 'incident_by_user'
            };        
        if (!this.currentUserCan('edit_others_incident')) {
            queryParams.startkey = [currentUser,'incident_'];
            queryParams.endkey = [currentUser,'incident_'+maxValue];            
        }
        return queryParams;
    },   
    
    actions: {

        editIncident: function(incident){
            console.log("this edit incident"+incident);
            this.send('editItem',incident);
        }
    }

});