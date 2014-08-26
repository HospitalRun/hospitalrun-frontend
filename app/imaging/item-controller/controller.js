export default Ember.ObjectController.extend({
    actions: {
        editImaging: function(imaging) {
            if (this.get('canEdit')) {
                this.parentController.send('editImaging', imaging);
            }
        }
    },
    
    canEdit: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status')
});