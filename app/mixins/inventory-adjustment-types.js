import Ember from 'ember';

export default Ember.Mixin.create({
  adjustmentTypes: function() {
    let i18n = this.get('i18n');
    return [
      {
        name: i18n.t('inventory.labels.addAdjustmentType').toString(),
        type: 'Adjustment (Add)'
      },
      {
        name: i18n.t('inventory.labels.removeAdjustmentType').toString(),
        type: 'Adjustment (Remove)'
      },
      {
        name: i18n.t('inventory.labels.returnToVendorAdjustmentType').toString(),
        type: 'Return To Vendor'
      },
      {
        name: i18n.t('inventory.labels.returnAdjustmentType').toString(),
        type: 'Return'
      },
      {
        name: i18n.t('inventory.labels.writeOffAdjustmentType').toString(),
        type: 'Write Off'
      }
    ];
  }.property()
});
