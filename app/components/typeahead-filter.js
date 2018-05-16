<<<<<<< HEAD
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
=======
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
