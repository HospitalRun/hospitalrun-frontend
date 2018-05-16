<<<<<<< HEAD
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
    cancel() {
      this.send('closeModal');
    },

    add() {
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
=======
import EmberObject from '@ember/object';
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

  billingCategories: function() {
    let defaultBillingCategories = this.get('defaultBillingCategories');
    let billingCategoryList = this.get('billingCategoryList');
    if (isEmpty(billingCategoryList)) {
      return EmberObject.create({ value: defaultBillingCategories });
    } else {
      return billingCategoryList;
    }
  }.property('billingCategoryList', 'defaultBillingCategories')

});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
