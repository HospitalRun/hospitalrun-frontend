import Ember from 'ember';
export default Ember.Mixin.create({

  additionalButtons: null,
  cancelButtonText: null,
  disabledAction: null,
  hideCancelButton: null,
  showUpdateButton: null,
  updateButtonAction: null,
  updateButtonIcon: null,
  updateButtonText: null,

  editPanelProps: function() {
    return this.getProperties([
      'additionalButtons',
      'cancelButtonText',
      'disabledAction',
      'hideCancelButton',
      'showUpdateButton',
      'updateButtonAction',
      'updateButtonIcon',
      'updateButtonText'
    ]);
  }.property('additionalButtons',
             'cancelButtonText',
             'disabledAction',
             'hideCancelButton',
             'showUpdateButton',
             'updateButtonAction',
             'updateButtonIcon',
             'updateButtonText')
});
