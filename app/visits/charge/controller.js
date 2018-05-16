<<<<<<< HEAD
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';
import Ember from 'ember';

export default ProcedureChargeController.extend({
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: Ember.inject.controller('visits/edit')
});
=======
import { inject as controller } from '@ember/controller';
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';

export default ProcedureChargeController.extend({
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: controller('visits/edit')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
