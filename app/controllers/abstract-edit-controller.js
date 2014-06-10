export default Ember.ObjectController.extend({
    isUpdateDisabled: function() {
        if (!Ember.isNone(this.get('isValid'))) {
            return !this.get('isValid');
        } else {
            return false;
        }
    }.property('isValid'),
    
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
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send('allItems');
        },
        
        update: function() {            
            this.get('model').save().then(function(record) {
                this.afterUpdate(record);
            }.bind(this));                
        }
    },
    
    /**
     * Override this function to perform logic after record update
     * @param record the record that was just updated.
     */
    afterUpdate: function() {
    }
});
