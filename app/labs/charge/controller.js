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
