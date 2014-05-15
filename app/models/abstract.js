export default DS.Model.extend({
    lastModified: DS.attr('date'),
    modifiedBy: DS.attr(),
    modifiedFields: DS.attr(),
    
    save: function() {
        var attribute,
            changedAttributes = this.changedAttributes(),
            modifiedDate = new Date(),
            modifiedFields = this.get('modifiedFields');    
        if (this.get('isDirty') && !this.get('isDeleted')) {
            console.log("have dirty record");
            if (Ember.isEmpty(modifiedFields)) {
                modifiedFields = {};
            }        
            this.set('lastModified', modifiedDate);        
            for (attribute in changedAttributes) {
                modifiedFields[attribute] = modifiedDate;
            }
            console.log("DIRTY record, modified:",modifiedFields);
            this.set('modifiedFields', modifiedFields);
        }
        return this._super();
    }
});