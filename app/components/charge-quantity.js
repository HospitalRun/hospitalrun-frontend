import Ember from 'ember';
export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  classNames: ['col-xs-2', 'form-group'],
  classNameBindings: ['hasError'],
  tagName: 'td',
  pricingItem: null,

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    this.quantitySelected = Ember.computed.alias(`model.${this.get('pricingItem.id')}`);
  },

  hasError: function() {
    let quantitySelected = this.get('quantitySelected');
    return (!Ember.isEmpty(quantitySelected) && isNaN(quantitySelected));
  }.property('quantitySelected'),

  quantityHelp: function() {
    if (this.get('hasError')) {
      return this.get('i18n').t('errors.invalidNumber');
    }
  }.property('hasError')

});
