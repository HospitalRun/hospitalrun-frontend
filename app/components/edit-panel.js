import Ember from 'ember';
export default Ember.Component.extend({
  editPanelProps: null,
  cancelAction: 'cancel',

  actions: {
    cancel() {
      this.sendAction('cancelAction');
    },
    disabledAction() {
      this.sendAction('editPanelProps.disabledAction');
    },
    fireButtonAction(buttonAction) {
      this.set(buttonAction, buttonAction);
      this.sendAction(buttonAction);
    },
    updateButtonAction() {
      this.sendAction('editPanelProps.updateButtonAction');
    }
  }
});
