import { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import ProcedureChargeController from 'hospitalrun/procedures/charge/controller';

export default ProcedureChargeController.extend({
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: controller('imaging/edit'),
  pricingList: alias('requestingController.chargesPricingList')
});
