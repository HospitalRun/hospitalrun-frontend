<<<<<<< HEAD
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
=======
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
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

  hasError: function() {
    let quantitySelected = this.get('quantitySelected');
    return !isEmpty(quantitySelected) && isNaN(quantitySelected);
  }.property('quantitySelected'),

  quantityHelp: function() {
    if (this.get('hasError')) {
      return this.get('i18n').t('errors.invalidNumber');
    }
  }.property('hasError')

});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
