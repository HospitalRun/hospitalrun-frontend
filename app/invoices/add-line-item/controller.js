import EmberObject, { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import BillingCategories from 'hospitalrun/mixins/billing-categories';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';

export default Controller.extend(BillingCategories, IsUpdateDisabled, {
  invoiceController: controller('invoices'),

  billingCategoryList: alias('invoiceController.billingCategoryList'),
  editController: controller('invoices/edit'),
  title: 'Add Line Item',
  updateButtonText: 'Add',
  updateButtonAction: 'add',
  showUpdateButton: true,

  actions: {
    cancel() {
      this.send('closeModal');
    },

    add() {
      this.get('model').save().then(function(record) {
        this.get('editController').send('addLineItem', record);
      }.bind(this));
    }
  },

  billingCategories: computed('billingCategoryList', 'defaultBillingCategories', function() {
    let defaultBillingCategories = this.get('defaultBillingCategories');
    let billingCategoryList = this.get('billingCategoryList');
    if (isEmpty(billingCategoryList)) {
      return EmberObject.create({ value: defaultBillingCategories });
    } else {
      return billingCategoryList;
    }
  })

});
