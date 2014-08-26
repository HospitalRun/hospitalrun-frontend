export default Ember.ObjectController.extend({
    actions: {
        editImaging: function() {
            if (this.get('canEdit')) {
                this.parentController.send('editImaging');
            }
        }
    },
    
    canEdit: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status')
});