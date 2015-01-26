import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';
import Ember from "ember";

export default ProcedureChargeController.extend({
    needs: ['imaging/edit'],
    cancelAction: 'closeModal',
    newPricingItem: false,
    requestingController: Ember.computed.alias('controllers.imaging/edit'),
    pricingList: Ember.computed.alias('controllers.imaging/edit.pricingList'),    
});
