<<<<<<< HEAD
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';
import Ember from 'ember';

export default ProcedureChargeController.extend({
  labsEdit: Ember.inject.controller('labs/edit'),
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: Ember.computed.alias('controllers.labs/edit'),
  pricingList: Ember.computed.alias('controllers.labs/edit.chargesPricingList')
});
=======
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';

export default ProcedureChargeController.extend({
  labsEdit: controller('labs/edit'),
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: alias('controllers.labs/edit'),
  pricingList: alias('controllers.labs/edit.chargesPricingList')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
