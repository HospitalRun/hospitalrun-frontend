/**
 * Promise tree schema.
 */
export default {
  columns: [{
    id: 'label',
    name: 'Label',
    visible: true
  }, {
    id: 'state',
    name: 'State',
    visible: true
  }, {
    id: 'settled-value',
    name: 'Fulfillment / Rejection value',
    visible: true
  }, {
    id: 'time',
    name: 'Time to settle',
    visible: true
  }]
};
