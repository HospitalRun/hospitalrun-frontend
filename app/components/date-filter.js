<<<<<<< HEAD
import Ember from 'ember';
import PikadayComponent from 'hospitalrun/mixins/pikaday-component';

const {
  Component
} = Ember;

export default Component.extend(PikadayComponent, {
  classNames: ['input-group'],
  dateSetAction: 'filter',

  actions: {
    clearFilter() {
      let $input = this.$('input');
      $input.val('');
      this.sendAction('dateSetAction');
    }
  }
});
=======
import Component from '@ember/component';
import PikadayComponent from 'hospitalrun/mixins/pikaday-component';

export default Component.extend(PikadayComponent, {
  classNames: ['input-group'],
  dateSetAction: 'filter',

  actions: {
    clearFilter() {
      let $input = this.$('input');
      $input.val('');
      this.sendAction('dateSetAction');
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
