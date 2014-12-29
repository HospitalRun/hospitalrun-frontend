import Ember from "ember";
export default Ember.ObjectController.extend({
    needs: 'patients/edit',

    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Photo';
        } else {
            return 'Edit Photo';
        }
    }.property('isNew'),
    
    updateButtonText: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew'),

    updateButtonAction: 'update',
    showUpdateButton: true,
    
    editController: Ember.computed.alias('controllers.patients/edit'),    
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        update: function() {
            var caption = this.get('caption'),
                isNew = this.get('isNew'),
                photoFile = this.get('photoFile');
            if (isNew) {
                this.get('editController').send('addPhoto', photoFile, caption);
            } else {
                this.get('editController').send('updatePhoto', this.get('model'));                
            }
        }
    }
});
