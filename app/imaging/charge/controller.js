import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';
import Ember from 'ember';

export default ProcedureChargeController.extend({
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: Ember.inject.controllers('imaging/edit'),
  pricingList: Ember.computed.alias('requestingController.chargesPricingList')
});
