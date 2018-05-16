<<<<<<< HEAD
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';
import Ember from 'ember';

export default ProcedureChargeController.extend({
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: Ember.inject.controllers('imaging/edit'),
  pricingList: Ember.computed.alias('requestingController.chargesPricingList')
});
=======
import { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';

export default ProcedureChargeController.extend({
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: controller('imaging/edit'),
  pricingList: alias('requestingController.chargesPricingList')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
