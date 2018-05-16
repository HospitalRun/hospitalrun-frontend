<<<<<<< HEAD
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  defaultInventoryTypes: [
    'Medication',
    'Supply'
  ],

  inventoryTypes: function() {
    let defaultInventoryTypes = this.get('defaultInventoryTypes');
    let inventoryTypeList = this.get('inventoryTypeList');
    let typeList;
    if (Ember.isEmpty(inventoryTypeList)) {
      typeList = defaultInventoryTypes;
    } else {
      typeList = inventoryTypeList;
    }
    typeList = SelectValues.selectValues(typeList);
    return typeList;
  }.property('inventoryTypeList', 'defaultInventoryTypes')
});
=======
import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import SelectValues from 'hospitalrun/utils/select-values';
export default Mixin.create({
  defaultInventoryTypes: [
    'Medication',
    'Supply'
  ],

  inventoryTypes: function() {
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
  }.property('inventoryTypeList', 'defaultInventoryTypes')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
