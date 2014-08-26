export default Ember.ObjectController.extend({
    actions: {
        editLab: function(lab) {
            if (this.get('canEdit')) {
                this.parentController.send('editLab', lab);
            }
        }
    },
    
    canEdit: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status')
});