import Ember from 'ember';
export default Ember.Mixin.create({

  additionalButtons: null,
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
      'cancelButtonText',
      'disabledAction',
      'hideCancelButton',
      'isUpdateDisabled',
      'showUpdateButton',
      'updateButtonAction',
      'updateButtonText'
    ]);
  }.property('additionalButtons',
             'cancelButtonText',
             'disabledAction',
             'hideCancelButton',
             'isUpdateDisabled',
             'showUpdateButton',
             'updateButtonAction',
             'updateButtonText')
});
