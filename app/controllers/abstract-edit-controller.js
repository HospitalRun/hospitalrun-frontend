export default Ember.ObjectController.extend({
    /**
     *  Lookup lists that should be updated when the model has a new value to add to the lookup list.
     *  lookupListsToUpdate: [{
     *      name: 'countryList', //Name of property containing lookup list
     *      property: 'country', //Corresponding property on model that potentially contains a new value to add to the list
     *      id: 'country_list' //Id of the lookup list to update
     *  }
     */
    lookupListsToUpdate: null,
    
    isUpdateDisabled: function() {
        if (!Ember.isNone(this.get('isValid'))) {
            return !this.get('isValid');
        } else {
            return false;
        }
    }.property('isValid'),
    
    updateButtonAction: 'update',
    
    updateButtonText: function() {
        if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew'),
    
    actions: {
        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send('allItems');
        },
        
        update: function() {
            this.beforeUpdate();
            this.get('model').save().then(function(record) {
                this.updateLookupLists();
                this.afterUpdate(record);
            }.bind(this));                
        }
    },
    
    /**
     * Override this function to perform logic after record update
     * @param record the record that was just updated.
     */
    afterUpdate: function() {
    },
    
    /**
     * Override this function to perform logic before record update.
     */
    beforeUpdate: function() {
    },
    
    /**
     * Update any new values added to a lookup list
     */
    updateLookupLists: function() {
        var lookupLists = this.get('lookupListsToUpdate');        
        if (!Ember.isEmpty(lookupLists)) {            
            lookupLists.forEach(function(list) {
                var propertyValue = this.get(list.property),
                    lookupList = this.get(list.name);
                if (lookupList) {
                    var lookupListValues = lookupList.get('value');
                    if (!lookupListValues.contains(propertyValue)) {
                        lookupListValues.push(propertyValue);
                        lookupListValues.sort();
                        lookupList.set('value', lookupListValues);
                        lookupList.save();
                        this.set(list.name, lookupList);
                    }
                } else {
                    lookupList = this.get('store').push('lookup',{
                        id: list.id,
                        value: [propertyValue]
                    });
                    lookupList.save();
                    this.set(list.name, lookupList);
                }                
            }.bind(this));
        }
    }


});
