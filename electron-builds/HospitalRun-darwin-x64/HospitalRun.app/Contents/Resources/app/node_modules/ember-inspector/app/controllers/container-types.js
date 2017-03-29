import Ember from "ember";
const { Controller, computed: { sort } } = Ember;

export default Controller.extend({
  sortProperties: ['name'],
  sorted: sort('model', 'sortProperties')
});
