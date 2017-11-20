import { isArray } from '@ember/array';
import Component from '@ember/component';
export default Component.extend({
  isArray: function() {
    let content = this.get('content');
    return isArray(content);
  }.property('content')
});
