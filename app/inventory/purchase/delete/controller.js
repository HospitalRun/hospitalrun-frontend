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
        return 'Delete Purchase';
    }.property('expire'),
    
    actions: {
        cancel: function() {
            this.set('expire');
            this.send('closeModal');
        },
        
        delete: function() {
            var expire = this.get('expire');
            if (!Ember.isEmpty(expire) && expire === true) {
                this.send('expirePurchase', this.get('model'));
            } else{
                this.send('deletePurchase', this.get('model'));
            }
        }
    }
});