import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";

export default AbstractEditController.extend({
    needs: ['incident/edit','incident'],
    
    cancelAction: 'closeModal',
    
    editController: Ember.computed.alias('controllers.incident/edit'),

    userList: Ember.computed.alias('controllers.incident.userList'),

    newReviewer: false,

    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Reviewer';
        }
        return 'Edit Reviewer';
    }.property('isNew'),
    
    updateCapability: 'add_reviewer',
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newReviewer', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(reviewer) {
        if (this.get('newReviewer')) {            
            this.get('editController').send('addReviewer',reviewer);
        } else {
            this.send('closeModal');
        }
    }
});
