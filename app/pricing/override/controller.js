import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import SelectValues from 'hospitalrun/utils/select-values';

export default Ember.Controller.extend(IsUpdateDisabled, {
  pricingController: Ember.inject.controller('pricing'),

  actions: {
    cancel: function() {
      this.get('model').rollbackAttributes();
      this.send('closeModal');
    },

    update: function() {
      let isNew = this.get('model.isNew');
      let override = this.get('model');
      override.save().then(function() {
        if (isNew) {
          this.get('editController').send('addOverride', override);
        } else {
          this.send('closeModal');
        }
      }.bind(this));
    }
  },

  editController: Ember.inject.controller('pricing/edit'),
  pricingProfiles: Ember.computed.map('pricingController.pricingProfiles', SelectValues.selectObjectMap),
  showUpdateButton: true,

  title: function() {
    if (this.get('model.isNew')) {
      return 'Add Override';
    } else {
      return 'Edit Override';
    }
  }.property('model.isNew'),

  updateButtonAction: 'update',
  updateButtonText: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add';
    } else {
      return 'Update';
    }
  }.property('model.isNew')

});
