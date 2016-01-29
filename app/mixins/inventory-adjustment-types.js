import Ember from 'ember';
export default Ember.Mixin.create({
  adjustmentTypes: [{
    name: 'Add',
    type: 'Adjustment (Add)'
  }, {
    name: 'Remove',
    type: 'Adjustment (Remove)'
  }, {
    name: 'Return To Vendor',
    type: 'Return To Vendor'
  }, {
    name: 'Return',
    type: 'Return'
  }, {
    name: 'Write Off',
    type: 'Write Off'
  }]
});
