import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  attributeBindings: ['role'],
  classNameBindings: ['active'],
  index: null,
  pricingList: null,
  role: 'presentation',
  tagName: 'li',

  active: computed(function() {
    let index = this.get('index');
    return (index === 0);
  }),

  tabId: computed('pricingType', function() {
    return this.get('pricingType').toLowerCase().dasherize();
  }),

  tabHref: computed('tabId', function() {
    let tabId = this.get('tabId');
    return `#${tabId}`;
  })
});
