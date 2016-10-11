import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
export default AbstractIndexRoute.extend(ModalHelper, {
  category: null,
  modelName: 'price-profile',
  pageTitle: 'Pricing Profiles',

  actions: {
    editItem: function(item) {
      this.send('openModal', 'pricing.profiles.edit', item);
    },

    deleteItem: function(item) {
      var message = 'Are you sure you want to delete this profile?',
        model = Ember.Object.create({
          itemToDelete: item
        }),
        title = 'Delete Profile';
      this.displayConfirm(title, message, 'deletePricingProfile', model);
    },

    deletePricingProfile: function(model) {
      model.itemToDelete.set('archived', true);
      model.itemToDelete.save().then(()=> {
        model.itemToDelete.unloadRecord();
      });
    },

    newItem: function() {
      var newItem = this.store.createRecord('price-profile');
      this.send('openModal', 'pricing.profiles.edit', newItem);
    },

    refreshProfiles: function() {
      this.refresh();
    }
  }
});
