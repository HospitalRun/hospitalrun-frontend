import Ember from "ember";
export default Ember.Component.extend({

  tagName: 'button',

  side: 'right',

  isExpanded: false,

  isRight: Ember.computed.equal('side', 'right'),

  classNames: 'sidebar-toggle',

  classNameBindings: 'isRight:sidebar-toggle--right:sidebar-toggle--left',

  click() {
    this.sendAction();
  }

});
