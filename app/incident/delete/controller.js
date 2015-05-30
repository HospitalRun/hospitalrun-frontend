import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from "ember";   
export default AbstractDeleteController.extend({
     title: 'Delete Item',
       
    _deleteChildObject: function(childObject){
        var destroyPromises = [];
        childObject.forEach(function(child) {
            destroyPromises.push(child.destroyRecord());  //Add the destroy promise to the list
        });
        return destroyPromises;
    },

    actions:{
    	
    	delete: function(){
            var destroyPromises = [];
            var incident = this.get('model');
            
            incident.get('reviewers').then(function(reviewers){
                reviewers.forEach(function(child) {
                    destroyPromises.push(child.destroyRecord());  //Add the destroy promise to the list
                });
            });

            Ember.RSVP.all(destroyPromises).then(function() {
                //fires when all the destroys have been completed.
                this.get('model').destroyRecord().then(function() { //delete incident                   
                        this.send('closeModal');
                }.bind(this));
            }.bind(this));
    	}
    }
});