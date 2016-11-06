import BillingCategories from 'hospitalrun/mixins/billing-categories';
import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';

export default Ember.Controller.extend(BillingCategories, IsUpdateDisabled, {
  invoiceController: Ember.inject.controller('invoices'),

  billingCategoryList: Ember.computed.alias('invoiceController.billingCategoryList'),
  editController: Ember.inject.controller('invoices/edit'),
  title: 'Add Line Item',
  updateButtonText: 'Add',
  updateButtonAction: 'add',
  showUpdateButton: true,

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    add: function() {
      this.get('model').save().then(function(record) {
        this.get('editController').send('addLineItem', record);
      }.bind(this));
    }
  },

  billingCategories: function() {
    let defaultBillingCategories = this.get('defaultBillingCategories');
    let billingCategoryList = this.get('billingCategoryList');
    if (Ember.isEmpty(billingCategoryList)) {
      return Ember.Object.create({ value: defaultBillingCategories });
    } else {
      return billingCategoryList;
    }
  }.property('billingCategoryList', 'defaultBillingCategories')

});
