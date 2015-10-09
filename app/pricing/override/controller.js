import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import SelectValues from 'hospitalrun/utils/select-values';

export default Ember.ObjectController.extend(IsUpdateDisabled, {
  needs: ['pricing', 'pricing/edit'],

  actions: {
    cancel: function () {
      this.get('model').rollback();
      this.send('closeModal');
    },

    update: function () {
      var isNew = this.get('isNew'),
        override = this.get('model');
      override.save().then(function () {
        if (isNew) {
          this.get('editController').send('addOverride', override);
        } else {
          this.send('closeModal');
        }
      }.bind(this));
    }
  },

  editController: Ember.computed.alias('controllers.pricing/edit'),
  pricingProfiles: Ember.computed.map('controllers.pricing.pricingProfiles', SelectValues.selectObjectMap),
  showUpdateButton: true,

  title: function () {
    if (this.get('isNew')) {
      return 'Add Override';
    } else {
      return 'Edit Override';
    }
  }.property('isNew'),

  updateButtonAction: 'update',
  updateButtonText: function () {
    var isNew = this.get('isNew');
    if (isNew) {
      return 'Add';
    } else {
      return 'Update';
    }
  }.property('isNew'),


});
