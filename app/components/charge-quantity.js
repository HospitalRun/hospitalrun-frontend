import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  i18n: service(),
  classNames: ['col-xs-2', 'form-group'],
  classNameBindings: ['hasError'],
  tagName: 'td',
  pricingItem: null,

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    this.quantitySelected = alias(`model.${this.get('pricingItem.id')}`);
  },

  hasError: computed('quantitySelected', function() {
    let quantitySelected = this.get('quantitySelected');
    return !isEmpty(quantitySelected) && isNaN(quantitySelected);
  }),

  quantityHelp: computed('hasError', function() {
    if (this.get('hasError')) {
      return this.get('i18n').t('errors.invalidNumber');
    }
  })

});
