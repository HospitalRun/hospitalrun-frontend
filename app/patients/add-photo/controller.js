export default Ember.ObjectController.extend({
    needs: 'patients/edit',

    title: 'Add Photo',
    updateButtonText: 'Add',
    updateButtonAction: 'add',
    showUpdateButton: true,
    
    editController: Ember.computed.alias('controllers.patients/edit'),    
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        add: function() {
            var photoFile = this.get('photoFile');
            this.get('editController').send('addPhoto', photoFile);
        }
    }
});
