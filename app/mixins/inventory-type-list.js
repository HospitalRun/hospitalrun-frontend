import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import SelectValues from 'hospitalrun/utils/select-values';
import { computed } from '@ember/object';

export default Mixin.create({
  defaultInventoryTypes: [
    'Medication',
    'Supply'
  ],

  inventoryTypes: computed('inventoryTypeList', 'defaultInventoryTypes', function() {
    let defaultInventoryTypes = this.get('defaultInventoryTypes');
    let inventoryTypeList = this.get('inventoryTypeList');
    let typeList;
    if (isEmpty(inventoryTypeList)) {
      typeList = defaultInventoryTypes;
    } else {
      typeList = inventoryTypeList;
    }
    typeList = SelectValues.selectValues(typeList);
    return typeList;
  })
});
