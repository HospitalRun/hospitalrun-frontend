import Ember from 'ember';
export default Ember.Mixin.create({
  /**
   * Display a message in a closable modal.
   * @param title string containing the title to display.
   * @param message string containing the message to display.
   */
  displayAlert: function(title, message, okAction) {
    this.send('openModal', 'dialog', Ember.Object.create({
      title: title,
      message: message,
      okAction: okAction,
      hideCancelButton: true,
      updateButtonAction: 'ok',
      updateButtonText: 'Ok'
    }));
  },

  displayConfirm: function(title, message, confirmAction, model) {
    if (Ember.isEmpty(model)) {
      model = Ember.Object.create();
    }
    model.set('confirmAction', confirmAction);
    model.set('title', title);
    model.set('message', message);
    model.set('updateButtonAction', 'confirm');
    model.set('updateButtonText', 'Ok');
    this.send('openModal', 'dialog', model);
  }
});
