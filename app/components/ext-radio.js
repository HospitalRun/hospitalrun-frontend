import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  includeOtherOption: false,
  otherOptionLabel: null,
  showInline: false,

  haveLabel: computed('content', function() {
    let firstRadio = this.get('content.firstObject');
    return !isEmpty(firstRadio.label);
  }),

  radioClass: computed('showInline', function() {
    if (this.get('showInline')) {
      return 'radio-inline';
    } else {
      return 'radio';
    }
  })
});
