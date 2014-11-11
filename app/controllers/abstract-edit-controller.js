import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";
import UserSession from "hospitalrun/mixins/user-session";
export default Ember.ObjectController.extend(IsUpdateDisabled, UserSession, {
    cancelAction: 'allItems',
    
    cancelButtonText: function() {
        var isDirty = this.get('isDirty');
        if (isDirty) {
            return 'Cancel';
        } else {
            return 'Return';
        }
    }.property('isDirty'),

    /**
     *  Lookup lists that should be updated when the model has a new value to add to the lookup list.
     *  lookupListsToUpdate: [{
     *      name: 'countryList', //Name of property containing lookup list
     *      property: 'country', //Corresponding property on model that potentially contains a new value to add to the list
     *      id: 'country_list' //Id of the lookup list to update
     *  }
     */
    lookupListsToUpdate: null,
    
    showUpdateButton: function() {
        var updateButtonCapability = this.get('updateCapability');
        return this.currentUserCan(updateButtonCapability);
    }.property('updateCapability'),
    
    updateButtonAction: 'update',    
    updateButtonText: function() {
        if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew'),
    updateCapability: null,
    
    actions: {
        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send(this.get('cancelAction'));
        },
        
        /**
         * Update the model and perform the before update and after update
         * @param skipAfterUpdate boolean (optional) indicating whether or not 
         * to skip the afterUpdate call.
         */
        update: function(skipAfterUpdate) {
            this.beforeUpdate().then(function() {
                this.get('model').save().then(function(record){
                    this.updateLookupLists();
                    if (!skipAfterUpdate) {
                        this.afterUpdate(record);
                    }

                }.bind(this));
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
     * @returns {Promise} Promise that resolves after before update is done.
     */
    beforeUpdate: function() {
        return Ember.RSVP.Promise.resolve();
    },
    
    /**
     * Update any new values added to a lookup list
     */
    updateLookupLists: function() {
        var lookupLists = this.get('lookupListsToUpdate'),
            listsToUpdate = Ember.A();
        if (!Ember.isEmpty(lookupLists)) {            
            lookupLists.forEach(function(list) {
                var propertyValue = this.get(list.property),
                    lookupList = this.get(list.name);
                if (!Ember.isEmpty(propertyValue)) {
                    if (lookupList) {
                        var lookupListValues = lookupList.get('value');
                        if (!lookupListValues.contains(propertyValue)) {
                            lookupListValues.push(propertyValue);
                            lookupListValues.sort();
                            lookupList.set('value', lookupListValues);
                            if (!listsToUpdate.contains(lookupList)) {
                                listsToUpdate.push(lookupList);
                            }
                            this.set(list.name, lookupList);
                        }
                    } else {
                        lookupList = this.get('store').push('lookup',{
                            id: list.id,
                            value: [propertyValue],
                            userCanAdd: true
                        });
                        if (!listsToUpdate.contains(lookupList)) {
                            listsToUpdate.push(lookupList);
                        }
                        this.set(list.name, lookupList);
                    }
                }
            }.bind(this));
            listsToUpdate.forEach(function(list) {
                list.save();
            });
        }
    }


});
