import Ember from 'ember';
export default Ember.Mixin.create({

  additionalButtons: null,
  cancelAction: null,
  cancelButtonText: null,
  disabledAction: null,
  hideCancelButton: null,
  isUpdateDisabled: null,
  showUpdateButton: null,
  updateButtonAction: null,
  updateButtonText: null,

  editPanelProps: function() {
    return this.getProperties([
      'additionalButtons',
      'cancelAction',
      'cancelButtonText',
      'disabledAction',
      'hideCancelButton',
      'isUpdateDisabled',
      'showUpdateButton',
      'updateButtonAction',
      'updateButtonText'
    ]);
  }.property('additionalButtons',
             'cancelAction',
             'cancelButtonText',
             'disabledAction',
             'hideCancelButton',
             'isUpdateDisabled',
             'showUpdateButton',
             'updateButtonAction',
             'updateButtonText')
});
