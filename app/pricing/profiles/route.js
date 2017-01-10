import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
export default AbstractIndexRoute.extend(ModalHelper, {
  category: null,
  modelName: 'price-profile',
  pageTitle: 'Pricing Profiles',

  actions: {
    editItem(item) {
      this.send('openModal', 'pricing.profiles.edit', item);
    },

    deleteItem(item) {
      let message = 'Are you sure you want to delete this profile?';
      let model = Ember.Object.create({
        itemToDelete: item
      });
      let title = 'Delete Profile';
      this.displayConfirm(title, message, 'deletePricingProfile', model);
    },

    deletePricingProfile(model) {
      model.itemToDelete.set('archived', true);
      model.itemToDelete.save().then(()=> {
        model.itemToDelete.unloadRecord();
      });
    },

    newItem() {
      let newItem = this.store.createRecord('price-profile');
      this.send('openModal', 'pricing.profiles.edit', newItem);
    },

    refreshProfiles() {
      this.refresh();
    }
  }
});
