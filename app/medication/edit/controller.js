import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend({
    title: function() {
        if (this.get('isNew')) {
            return 'New Request';
        } else {
            return 'Edit Request';
        }
    }.property('isNew'),

    actions: {
        search: function(searchfield) {
            var searchValue = searchfield.get('value').trim();
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
                        this.set('medicationId', false);
                        var medication = inventory.map(function(rec) {
                            if (!this.get('medicationId')) { //Set the first radio button
                                this.set('medicationId', rec.get('id'));
                            }
                            return {
                                label: rec.get('name'),
                                value: rec.get('id')
                            };
                        }.bind(this));
                        this.set('availableMeds', medication);
                    }
                    this.searching = false;
                }.bind(this));    
            } else if (searchValue === '') {
                this.set('availableMeds', null);                
            }            
        }        
    },
    afterUpdate: function(record) {
        this.transitionToRoute('/medication/search/'+record.get('id'));
    }
});
