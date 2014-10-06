import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";
export default Ember.ObjectController.extend(IsUpdateDisabled, {
    
    needs: 'admin/lookup',
    
    editController: Ember.computed.alias('controllers.admin/lookup'),
    showUpdateButton: true,
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Value';
        } else {
            return 'Edit Value';
        }
    }.property('isNew'),
    
    updateButtonAction: 'update',

    updateButtonText: function() {
        var isNew = this.get('isNew');
        if (isNew) {
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
            if (!Ember.isEmpty(this.get('value'))) {
                this.get('editController').send('updateValue', this.get('model'));
                this.send('closeModal');
            }
        }
    }
});
