export default Ember.ObjectController.extend({
    updateButtonText: function() {
        var expire = this.get('expire');
        if (!Ember.isEmpty(expire) && expire === true) {
            return 'Expire';
        } 
        return  'Delete';
    }.property('expire'),
    updateButtonAction: 'delete',
    isUpdateDisabled: false,
    title:  function() {
        var expire = this.get('expire');
        if (!Ember.isEmpty(expire) && expire === true) {
            return 'Expire';
        }
        return 'Delete Batch';
    }.property('expire'),
    
    actions: {
        cancel: function() {
            this.set('expire');
            this.send('closeModal');
        },
        
        delete: function() {
            var expire = this.get('expire');
            if (!Ember.isEmpty(expire) && expire === true) {
                this.send('expireBatch', this.get('model'));
            } else{
                this.send('deleteBatch', this.get('model'));
            }
        }
    }
});