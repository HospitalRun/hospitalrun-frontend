import Ember from "ember";
import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";
export default Ember.ObjectController.extend(IsUpdateDisabled, {    
    needs: 'patients',
    
    editController: Ember.computed.alias('controllers.patients'),
    showUpdateButton: true,
    title: 'Family Info',    
    updateButtonAction: 'update',
    updateButtonText: function() {
        if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew'),
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        update: function() {
            var model = this.getProperties('isNew','name','age','civilStatus','relationship','education','occupation','income','insurance');
            this.get('editController').send('updateFamilyInfo', model);
        }
    }
});
