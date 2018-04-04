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
