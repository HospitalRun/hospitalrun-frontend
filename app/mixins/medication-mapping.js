export default Ember.Mixin.create({
    fieldMapping: {
        'medicationId': 'inventory'
    },
    _mapViewResults: function(data) {        
        var previousRow, mappedRows=[];
        data.forEach(function (row) {
            if (row) {
                if (row.type && row.type === 'Medication') { 
                    previousRow.medicationName = row.name; 
                } else { 
                    mappedRows.push(row); 
                } 
                previousRow = row; 
            }
        });
        return mappedRows;
    }
});