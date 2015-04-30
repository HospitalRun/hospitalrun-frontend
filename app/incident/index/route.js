import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from "ember";
export default AbstractIndexRoute.extend({
    modelName: 'incident',
    pageTitle: 'Incidents',
    
    _getStartKeyFromItem: function(item) {        
        return [item.get('reportedBy'),'incident_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var controller = this.controllerFor('incident/index'),
            maxValue = this.get('maxValue'),
            currentUser = controller.getCurrentUserName(),
            userList = controller.get('userList'),            
            userObject = userList.findBy('name', currentUser),
            queryParams = {
                mapReduce: 'incident_by_user'
            };        
        if (!Ember.isEmpty(userObject)){
            var userRoles = userObject.get('roles');
            if(!(userRoles.contains('Quality')) && !(userRoles.contains('admin'))){
                queryParams.startkey = [currentUser,'incident_'];
                queryParams.endkey = [currentUser,'incident_'+maxValue];
            }
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