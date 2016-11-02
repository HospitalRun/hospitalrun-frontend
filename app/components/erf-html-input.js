import HTMLInput from 'ember-rapid-forms/components/html-input';
import layout from '../templates/components/html-input';

export default HTMLInput.extend({
  layout,
  actions: {
    update(value) {
      let sanitize = this.get('mainComponent.sanitize');
      if (sanitize && sanitize.call) {
        value = sanitize(value);
      }
      this.set('selectedValue', value);
    }
  }
});
