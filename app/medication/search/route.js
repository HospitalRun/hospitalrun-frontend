import MedicationRouter from 'hospitalrun/medication/route';

export default MedicationRouter.extend({
    queryParams: {        
        searchText: {
            refreshModel: true
        },
        idToFind:  {
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
            mapResults: this._mapViewResults,
            fieldMapping: this.fieldMapping
        };
        if (params.queryParams.searchText) {
            queryParams['containsValue'] = {
                value: params.queryParams.searchText,
                keys: [
                    'prescription',
                    'patientId'
                ]
            };
        } else if (params.queryParams.idToFind) {
            queryParams['idToFind'] = params.queryParams.idToFind;
        }

        return this.store.find('medication', queryParams);
    }
    
});
