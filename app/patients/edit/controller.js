import GenderList from 'hospitalrun/mixins/gender-list';    

export default Ember.ObjectController.extend(GenderList, Ember.SimpleAuth.AuthenticatedRouteMixin, Ember.Validations.Mixin, {
    isUpdateDisabled: function() {
        if (!Ember.isNone(this.get('isValid'))) {
            return !this.get('isValid');
        } else {
            return false;
        }
    }.property('isValid'),
    
    
    buttonText: function() {
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
            this.send('closeModal');
        },
        
        update: function() {            
            this.get('model').save().then(function(record) {
                this.send('closeModal');
                this.transitionToRoute('/patients/search/'+record.get('id'));
            }.bind(this));                
        }
    }
});
