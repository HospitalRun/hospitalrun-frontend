import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
    editTitle: 'Edit Lab Request',
    modelName: 'lab',
    newTitle: 'New Lab Request',
    
    getNewData: function() {
        return {
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        };
    },
    
    setupController: function(controller, model) {
        this._super(controller, model);
        var pricingQuery = {
            startkey:  ['Lab','pricing_'],
            endkey: ['Lab','pricing_\uffff'],
            include_docs: true,
        };        
        this.controllerFor('pouchdb').queryMainDB(pricingQuery, 'pricing_by_category').then(function(result) {
            var pricingList = result.rows.map(function(item) {
                return item.doc;
            });
            controller.set('labTypesList', pricingList);
        });
    }
});