import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  unitList: [
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
    'gel',
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

  unitListForSelect: Ember.computed.map('unitList', SelectValues.selectValuesMap)
});
