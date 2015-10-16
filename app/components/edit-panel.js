import Ember from 'ember';
export default Ember.Component.extend({
  editPanelProps: null,

  actions: {
    cancel: function() {
      this.sendAction('editPanelProps.cancelAction');
    },
    disabledAction: function() {
      this.sendAction('editPanelProps.disabledAction');
    },
    fireButtonAction: function(buttonAction) {
      this.set(buttonAction, buttonAction);
      this.sendAction(buttonAction);
    },
    updateButtonAction: function() {
      this.sendAction('editPanelProps.updateButtonAction');
    }
  }
});
