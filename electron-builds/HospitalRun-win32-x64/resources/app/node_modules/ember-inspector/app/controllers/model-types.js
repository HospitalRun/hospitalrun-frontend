import Ember from "ember";
const { Controller, computed, get, inject } = Ember;
const { sort } = computed;
const { controller } = inject;

export default Controller.extend({
  application: controller(),
  navWidth: 180,
  sortProperties: ['name'],
  options: {
    hideEmptyModelTypes: false
  },

  sorted: sort('filtered', 'sortProperties'),

  filtered: computed('model.@each.count', 'options.hideEmptyModelTypes', function() {
    return this.get('model').filter(item => {
      let hideEmptyModels = get(this, 'options.hideEmptyModelTypes');

      if (hideEmptyModels) {
        return !!get(item, 'count');
      } else {
        return true;
      }
    });
  })
});
