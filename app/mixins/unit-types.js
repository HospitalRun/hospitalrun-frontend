import Ember from "ember";
export default Ember.Mixin.create({
    defaultUnitList: [
        'ampoule',
        'bag',
        'bottle',
        'box',
        'bundle',
        'capsule',
        'case',
        'container',
        'cream',
        'each',
        'gallon',
        'gel',
        'ml',
        'nebule',
        'ointment',
        'pack',
        'pair',
        'pallet',
        'patch',
        'pcs',
        'pill',
        'plastic',
        'polyamp',
        'roll',
        'sachet',
        'spray',
        'suppository',
        'suspension',
        'set',
        'syrup',
        'tablet',
        'tray',
        'tube',
        'vial'
    ],

    unitList: function() {
      var defaultUnitList = this.get('defaultUnitList'),
          inventoryUnitList = this.get('inventoryUnitList');
      if (Ember.isEmpty(inventoryUnitList)) {
          return defaultUnitList;
      } else {
          return inventoryUnitList;
      }
    }.property('inventoryUnitList', 'defaultUnitList')
});
