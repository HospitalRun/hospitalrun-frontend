import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";

export default AbstractEditController.extend({
    needs: 'incident/edit',
    
    cancelAction: 'closeModal',
    
    editController: Ember.computed.alias('controllers.incident/edit'),    
    
    newRecommendation: false,
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Recommendation';
        }
        return 'Edit Recommendation';
    }.property('isNew'),
    
    updateCapability: 'add_recommendation',
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newRecommendation', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(recommendation) {
        if (this.get('newRecommendation')) {            
            this.get('editController').send('addRecommendation',recommendation);
        } else {
            this.send('closeModal');
        }
    }
});
