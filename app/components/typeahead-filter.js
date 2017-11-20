import Component from '@ember/component';
import TypeAhead from 'hospitalrun/mixins/typeahead';
export default Component.extend(TypeAhead, {
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
