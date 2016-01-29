import Ember from 'ember';
export default Ember.Mixin.create({
  /**
   * Display a message in a closable modal.
   * @param title string containing the title to display.
   * @param message string containing the message to display.
   */
  displayAlert: function(title, message, okAction) {
    let i18n = this.get('i18n');
    let modalOptions = Ember.Object.extend({
      updateButtonText: i18n.t('buttons.ok')
    });
    this.send('openModal', 'dialog', modalOptions.create({
      title: title,
      message: message,
      okAction: okAction,
      hideCancelButton: true,
      updateButtonAction: 'ok'
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
