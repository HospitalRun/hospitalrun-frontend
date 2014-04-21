export default Ember.ArrayController.extend(Ember.Validations.Mixin, {
    validations: {
        name: {
            presence: true,
            length: { minimum: 5 }
        },
        quantity: {
            numericality: true
        }
    },
    
    actions: {
        newInventoryItem: function() {
            if (this.get('isValid')) {
                var inventory = this.store.createRecord('inventory', {
                    //id: this.get('newId'),
                    name: this.get('name'),
                    description: this.get('description')
                });
                inventory.save();
            } else {
                console.log("RECORD IS INVALID");
            }
        }
    }
});
