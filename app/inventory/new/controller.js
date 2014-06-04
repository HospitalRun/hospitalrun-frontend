export default Ember.Controller.extend({
    name: null,
    description: null,
    crossReference: null,
    type: null,
    quantity: null,
    price: null,

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
        },
        price: {
            numericality: {
                allowBlank: true
            }
        }
    },    
    
    actions: {
        submit: function() {
            var newId = this.generateId();
            var data = this.getProperties('name', 'description','crossReference','type', 'quantity', 'price');
            data.id = newId;
            var inventory = this.store.createRecord('inventory', data);
            this.setProperties({name: null, description: null, crossReference: null, type: null, quantity: null, price: null});
            var controller = this;
            inventory.save().then(function(){                 
                controller.send('closeModal');
                controller.transitionToRoute('/inventory/search/'+newId);                                    
            });                
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
