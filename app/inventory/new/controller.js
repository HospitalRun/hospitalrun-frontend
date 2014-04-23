export default Ember.ArrayController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, Ember.Validations.Mixin, {
    inventoryTypes: [
        'Asset',
        'Medication',
        'Supply'
    ],
    
    validations: {
        name: {
            presence: true,
        },
        quantity: {
            numericality: true
        }
    },
    
    isValidRecord: true,
    
    actions: {
        submit: function() {
            if (this.get('isValid')) {
                this.set('isValidRecord',true);
                var newId = this.generateId();
                var inventory = this.store.createRecord('inventory', {
                    id: newId,
                    name: this.get('name'),
                    description: this.get('description'),
                    crossReference: this.get('crossReference'),
                    type: this.get('inventoryType'),
                    quantity: this.get('quantity'),
                });
                var controller = this;
                inventory.save().then(function(){ 
                    controller.transitionToRoute('inventory.search', {
                        queryParams: {
                            searchText: newId
                        }
                    });
                });                
            } else {
                this.set('isValidRecord',false);
                console.log("RECORD IS INVALID");
            }
        }
    },
        
    generateId: function() {
        var min = 1,
            max = 999,
            part1 = new Date().getTime(),
            part2 = Math.floor(Math.random() * (max - min + 1)) + min;            
        return part1.toString(36) +'_' + part2.toString(36);                
    }
});
