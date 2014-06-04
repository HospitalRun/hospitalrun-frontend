export default Ember.ObjectController.extend({    
    availableMeds: false,
    
    searching: false,
    
    actions: {
        search: function(searchfield) {

            var searchValue = searchfield.get('value').trim(),
                controller = this;
            if (!this.searching &&  searchValue !== '') {
                this.searching = true;
                var queryParams = {
                    containsValue: {
                        value: searchValue,
                        keys: [
                            'description',
                            'name'
                        ]
                    },
                    keyValues: {
                        type: 'Medication'
                    }
                };
                this.store.find('inventory', queryParams).then(function(inventory) {
                    if (inventory !== undefined) {
                        controller.set('medicationId', false);
                        var medication = inventory.map(function(rec) {
                            if (!controller.get('medicationId')) { //Set the first radio button
                                controller.set('medicationId', rec.get('id'));
                            }
                            return {
                                label: rec.get('name'),
                                value: rec.get('id')
                            };
                        });
                        controller.set('availableMeds', medication);
                    }
                    controller.searching = false;
                });    
            } else if (searchValue === '') {
                controller.set('availableMeds', null);                
            }
            
        },
        
        submit: function() {
            var request = this.store.createRecord('medication', {                 
                medicationId: this.get('medicationId'),
                patientId: this.get('patientId'),
                prescription: this.get('prescription'),
                quantity: this.get('quantity'),
                status: 'Requested'
            });
            var controller = this;
            request.save().then(function(){ 
                controller.transitionToRoute('medication.search', {
                    queryParams: {
                        idToFind: request.get('id')
                    }
                });
            });                
        }
    }
});
