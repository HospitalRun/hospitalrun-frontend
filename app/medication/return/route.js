import MedicationEditRoute from '../edit/route';
import Ember from 'ember';

export default MedicationEditRoute.extend({
    editTitle: 'Return Medication', 
    modelName: 'inv-request',
    newTitle: 'Return Medication',
    getNewData: function() {
        return Ember.RSVP.resolve({
            dateCompleted: new Date(),
            selectPatient: true,
            transactionType: 'Return'
        });
    }
});