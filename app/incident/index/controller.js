import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
    addPermission: 'add_incident',
    deletePermission: 'delete_incident',
    startKey: [],

    	actions: {

    		showDeleteIncident: function(incident) {
            	this.send('openModal', 'incident.delete', incident);
        	}
    	}
});