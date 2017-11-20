import { map } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import SelectValues from 'hospitalrun/utils/select-values';

export default Controller.extend(IsUpdateDisabled, {
  pricingController: controller('pricing'),

  actions: {
    cancel() {
      this.get('model').rollbackAttributes();
      this.send('closeModal');
    },

    update() {
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

  editController: controller('pricing/edit'),
  pricingProfiles: map('pricingController.pricingProfiles', SelectValues.selectObjectMap),
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
