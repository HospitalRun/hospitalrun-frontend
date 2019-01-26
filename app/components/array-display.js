import { isArray } from '@ember/array';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  isArray: computed('content', function() {
    let content = this.get('content');
    return isArray(content);
  })
});
