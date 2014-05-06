export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    _mapViewResults: function(data) {        
        var row, previousRow, mappedRows=[];
        data.forEach(function (row) {
            if (row.type && row.type === 'Medication') { 
                previousRow.medicationName = row.name; 
            } else { 
                mappedRows.push(row); 
            } 
            previousRow = row; 
        });
        return mappedRows;
    },
    
    model: function() {
        this.controllerFor('navigation').set('allowSearch',true);
        this.controllerFor('navigation').set('searchRoute','medication.search');
        return this.store.find('medication', {
            viewName: "medication/list",
            mapResults: this._mapViewResults
        });
    }
});

