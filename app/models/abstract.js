export default DS.Model.extend(Ember.Validations.Mixin, {
    lastModified: DS.attr('date'),
    modifiedBy: DS.attr(),
    modifiedFields: DS.attr(),

    /**
    * Before saving the record, update the modifiedFields attribute to denote what fields were changed when.
    * Also, if the save failed because of a conflict, reload the record and reapply the changed attributes and
    * attempt to save again.
    */
    save: function(retry) {
        var attribute,
            changedAttributes = this.changedAttributes(),
            modifiedDate = new Date(),
            modifiedFields = this.get('modifiedFields'),
            self = this;
        if (this.get('isDirty') && !this.get('isDeleted')) {
            if (Ember.isEmpty(modifiedFields)) {
                modifiedFields = {};
            }        
            this.set('lastModified', modifiedDate);        
            for (attribute in changedAttributes) {
                modifiedFields[attribute] = modifiedDate;
            }
            this.set('modifiedFields', modifiedFields);
        }
        
        return new Ember.RSVP.Promise(function(resolve, reject){
            self._super().then(function(results) {
                Ember.run(null, resolve, results);
            }, function(error) {
                if (retry) {
                    //We failed on the second attempt to save the record, so reject the save.
                    Ember.run(null, reject, error);
                } else {
                    if (error.indexOf('conflict') > -1) {
                        //Conflict encountered, so rollback, reload and then save the record with the changed attributes.
                        self.rollback();
                        self.reload().then(function(record) {
                            for (var attribute in changedAttributes) {
                                record.set(attribute, changedAttributes[attribute][1]);
                            }
                            record.save(true).then(function(results) {
                                Ember.run(null, resolve, results);
                            }, function(err) {
                                Ember.run(null, reject, err);
                            });

                        }, function(err) {
                            Ember.run(null, reject, err);
                        });
                    } else {
                        Ember.run(null, reject, error);
                    }
                }
            });
        });
    }
});