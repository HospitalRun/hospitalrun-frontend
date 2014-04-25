export default Ember.ObjectController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, Ember.Validations.Mixin, {    
    availableMeds: null,
    validations: {
        name: {
            presence: true,
        },
        quantity: {
            numericality: true
        }
    },
    
    searching: false,
    
    actions: {
        search: function(searchfield) {

            var searchValue = searchfield.get('value').trim(),
                controller = this;
            if (!this.searching &&  searchValue !== '') {
                this.searching = true;
                var queryParams = {
                    keys: [
                        'description',
                        'name'
                    ],                
                    containsValue: searchValue
                };
                this.store.find('inventory', queryParams).then(function(inventory) {
                    if (inventory !== undefined) {
                        controller.set('availableMeds', inventory.get('content'));                        
                    }
                    controller.searching = false;
                });    
            } else if (searchValue === '') {
                controller.set('availableMeds', null);                
            }
            
        },
        
        submit: function() {
            var request = this.store.createRecord('medication', {
                name: this.get('name'),
                description: this.get('description'),
                crossReference: this.get('crossReference'),
                status: 'Requested',
                quantity: this.get('quantity'),
            });
            var controller = this;
            request.save().then(function(){ 
                controller.transitionToRoute('medication.search', {
                    queryParams: {
                        searchText: '????'
                    }
                });
            });                
        }
    }
});
