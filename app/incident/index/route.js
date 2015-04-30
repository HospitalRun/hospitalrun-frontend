import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from "ember";
export default AbstractIndexRoute.extend({
    modelName: 'incident',
    pageTitle: 'Incidents',

    setupController: function(controller, model) {
        this._super(controller, model);
       
        var currentUser = controller.getCurrentUserName();
        console.log("currentUser"+currentUser);
        var userList = controller.get('userList');
        console.log("userlist"+userList);
        var userObject = userList.findBy('name', currentUser);
        var incidentList = [];
        if (!Ember.isEmpty(userObject)){
            var userRoles = userObject.get('roles');
            if((userRoles.contains('Quality')) || (userRoles.contains('admin'))){

        		var incidentQuery = {
            		startkey:  'incident_',
            		endkey: 'incident_\uffff',
            		include_docs: true,
        		};
        		this.controllerFor('pouchdb').queryMainDB(incidentQuery).then(function(result) {
                    incidentList = result.rows.map(function(item){
                        return item.doc;
                    });
                    controller.set('incidentsList', incidentList);
        		});
        	}
        	else
        	{
               	var userQuery = {
            		startkey:  [currentUser,'incident_'],
            		endkey: [currentUser,'incident_\uffff'],
            		include_docs: true,
        		};
        		this.controllerFor('pouchdb').queryMainDB(userQuery, 'incident_by_user').then(function(result) {
            		incidentList = result.rows.map(function(item){
            			return item.doc;
            		});
            		controller.set('incidentsList', incidentList);
            	});      	
            }
        }
    },

    actions: {

        editIncident: function(incident){
            console.log("this edit incident"+incident);
            this.send('editItem',incident);
        }
    }

});