export default Ember.Mixin.create({
    fieldMapping: {
        'patientId': 'patient'
    },
    _mapViewResults: function(data) {        
        var previousRow, mappedRows=[];
        data.forEach(function (row) {
            if (row) {
                if (row.type && row.type === 'Invoice') { 
                    previousRow.patientName = row.firstName+' '+row.lastName; 
                    previousRow.patient = row; 
                } else { 
                    mappedRows.push(row); 
                } 
                previousRow = row; 
            }
        });
        return mappedRows;
    }
});