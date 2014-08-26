export default Ember.ObjectController.extend({
    actions: {
        editMedication: function(medication) {
            if (this.get('canEdit')) {
                this.parentController.send('editMedication', medication);
            }
        }
    },

    canEdit: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status')
});