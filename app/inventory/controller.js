export default Ember.ArrayController.extend({
    actions: {
        newInventoryItem: function() {
            var newName = this.get('newName');
            if (newName && !newName.trim()) {
                this.set('newName', '');
                return;
            }
            var newDesc = this.get('newDesc');

            var inventory = this.store.createRecord('inventory', {
                id: 'org.couchdb.user:'+newUser,
                name: newName,
                description: newDescription
            });
            inventory.save();
        }
    }
});
