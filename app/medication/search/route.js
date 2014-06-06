import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
import MedicationMapping from 'hospitalrun/mixins/medication-mapping';
export default AbstractSearchRoute.extend(MedicationMapping, {
    searchKeys: [
        'prescription',
        'patientId'
    ],
    searchModel: 'medication',
    
    /**
     * Get the query params to run against the store find function.
     * By default this function will return a query that does a "contains"
     * search against all of the searchKeys defined for this route.
     * You can override this function if you need additional/different parameters.
     * @param searchText string containing text to search for.     
     */
    getQueryParams: function(searchText) {
        var queryParams = this._super(searchText);
        queryParams.mapResults = this._mapViewResults;
        queryParams.fieldMapping = this.fieldMapping;
        return queryParams;
    }
});