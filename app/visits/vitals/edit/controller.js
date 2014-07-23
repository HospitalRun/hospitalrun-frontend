import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
    needs: 'visits/edit',
    
    cancelAction: 'closeModal',
    
    editController: Ember.computed.alias('controllers.visits/edit'),    
    
    newVitals: false,
    
    temperatureLabel: 'Temperature (\xb0C)',
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Vitals';
        }
        return 'Edit Vitals';
	}.property('isNew'),
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newVitals', true);         
        }
        Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(vitals) {
        if (this.get('newVitals')) {            
            this.get('editController').send('addVitals',vitals);
        } else {
            this.send('closeModal');
        }
    }
});
