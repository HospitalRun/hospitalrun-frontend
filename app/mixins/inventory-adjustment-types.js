import Ember from 'ember';

export default Ember.Mixin.create({
  adjustmentTypes: function() {
    let i18n = this.get('i18n');
    return [
      {
        name: i18n.t('inventory.adjustmentTypes.add').toString(),
        type: 'Adjustment (Add)'
      },
      {
        name: i18n.t('inventory.adjustmentTypes.remove').toString(),
        type: 'Adjustment (Remove)'
      },
      {
        name: i18n.t('inventory.adjustmentTypes.returnToVendor').toString(),
        type: 'Return To Vendor'
      },
      {
        name: i18n.t('inventory.adjustmentTypes.return').toString(),
        type: 'Return'
      },
      {
        name: i18n.t('inventory.adjustmentTypes.writeOff').toString(),
        type: 'Write Off'
      }
    ];
  }.property()
});
