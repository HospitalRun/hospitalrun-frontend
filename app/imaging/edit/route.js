import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
    editTitle: 'Edit Imaging Request',
    modelName: 'imaging',
    newTitle: 'New Imaging Request',
    pricingCategory: 'Imaging',
    
    getNewData: function() {
        return Ember.RSVP.resolve({
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        });
    }
});