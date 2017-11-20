import { alias } from '@ember/object/computed';
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';
import Ember from 'ember';

export default ProcedureChargeController.extend({
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: Ember.inject.controllers('imaging/edit'),
  pricingList: alias('requestingController.chargesPricingList')
});
