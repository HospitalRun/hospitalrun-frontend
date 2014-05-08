import MedicationRouter from 'hospitalrun/medication/route';

export default MedicationRouter.extend({
    queryParams: {        
        searchText: {
            refreshModel: true
        }
    },
    
    actions: {
        queryParamsDidChange: function() {
            // opt into full refresh
            this.refresh();
        }
    },
    
    model: function(params) {
        var queryParams = {
            containsValue: {
                value: params.queryParams.searchText,
                keys: [
                    'prescription',
                    'patientId'
                ]
            },
            mapResults: this._mapViewResults,
            fieldMapping: this.fieldMapping
        };
        return this.store.find('medication', queryParams);
    }
    
});
