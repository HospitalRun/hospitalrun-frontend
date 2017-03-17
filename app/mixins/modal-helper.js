import Ember from 'ember';
export default Ember.Mixin.create({
  /**
   * Display a message in a closable modal.
   * @param title string containing the title to display.
   * @param message string containing the message to display.
   * @param okAction string containing the optional action to fire when the ok button is clicked.
   * @param okContext object containing the context to pass to the okAction.
   * @param cancelAction string containing the optional action to fire when the cancel button is clicked or the escape button is pressed.
   */
  displayAlert(title, message, okAction, okContext, cancelAction) {
    let i18n = this.get('i18n');
    let modalOptions = Ember.Object.extend({
      updateButtonText: i18n.t('buttons.ok')
    });
    this.send('openModal', 'dialog', modalOptions.create({
      cancelAction,
      hideCancelButton: true,
      message,
      okAction,
      okContext,
      title,
      updateButtonAction: 'ok'
    }));
  },

  displayConfirm(title, message, confirmAction, model) {
    let i18n = this.get('i18n');
    if (Ember.isEmpty(model)) {
      model = Ember.Object.create();
    }
    model.set('confirmAction', confirmAction);
    model.set('title', title);
    model.set('message', message);
    model.set('updateButtonAction', 'confirm');
    model.set('updateButtonText', i18n.t('buttons.ok'));
    this.send('openModal', 'dialog', model);
  }
});
