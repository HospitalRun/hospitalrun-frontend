import Ember from 'ember';
export default Ember.Component.extend({
  includeOtherOption: false,
  otherOptionLabel: null,
  showInline: false,

  haveLabel: function() {
    var firstRadio = this.get('content.firstObject');
    return !Ember.isEmpty(firstRadio.label);
  }.property('content'),

  radioClass: function() {
    if (this.get('showInline')) {
      return 'radio-inline';
    } else {
      return 'radio';
    }
  }.property('showInline')
});
