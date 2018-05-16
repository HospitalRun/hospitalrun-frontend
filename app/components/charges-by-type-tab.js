<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Component.extend({
  attributeBindings: ['role'],
  classNameBindings: ['active'],
  index: null,
  pricingList: null,
  role: 'presentation',
  tagName: 'li',

  active: function() {
    let index = this.get('index');
    return (index === 0);
  }.property(),

  tabId: function() {
    return this.get('pricingType').toLowerCase().dasherize();
  }.property('pricingType'),

  tabHref: function() {
    let tabId = this.get('tabId');
    return `#${tabId}`;
  }.property('tabId')
});
=======
import Component from '@ember/component';
export default Component.extend({
  attributeBindings: ['role'],
  classNameBindings: ['active'],
  index: null,
  pricingList: null,
  role: 'presentation',
  tagName: 'li',

  active: function() {
    let index = this.get('index');
    return (index === 0);
  }.property(),

  tabId: function() {
    return this.get('pricingType').toLowerCase().dasherize();
  }.property('pricingType'),

  tabHref: function() {
    let tabId = this.get('tabId');
    return `#${tabId}`;
  }.property('tabId')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
