import Ember from 'ember';
import TypeAhead from 'hospitalrun/mixins/typeahead';
export default Ember.Component.extend(TypeAhead, {
  classNames: ['input-group'],
  selectedAction: 'filter',
  setOnBlur: false,

  actions: {
    clearFilter() {
      let $input = this.$('.tt-input');
      $input.val('');
      this.sendAction('selectedAction');
    }
  }
});
