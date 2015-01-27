import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';
import Ember from 'ember';

export default ProcedureChargeController.extend({
    needs: ['visits/edit'],
    cancelAction: 'closeModal',
    newPricingItem: false,
    requestingController: Ember.computed.alias('controllers.visits/edit'),
    pricingList: Ember.computed.alias('controllers.visits/edit.pricingList'),    
});
