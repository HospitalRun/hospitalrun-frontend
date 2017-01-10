import Ember from 'ember';

const {
  computed,
  isEmpty
} = Ember;

const ALL_PROPS = [
  'actionForUpdateButton',
  'additionalButtons',
  'cancelButtonText',
  'disabledAction',
  'hideCancelButton',
  'showUpdateButton',
  'updateButtonAction',
  'updateButtonIcon',
  'updateButtonText'
];

export default Ember.Mixin.create({

  additionalButtons: null,
  cancelButtonText: null,
  disabledAction: null,
  hideCancelButton: null,
  showUpdateButton: null,
  updateButtonAction: null,
  updateButtonIcon: null,
  updateButtonText: null,

  actionForUpdateButton: computed('disabledAction', function() {
    let disabledAction = this.get('disabledAction');
    if (isEmpty(disabledAction) || disabledAction === false) {
      return 'updateButtonAction';
    } else {
      return 'disabledAction';
    }
  }),

  editPanelProps: computed(...ALL_PROPS, function() {
    return this.getProperties(ALL_PROPS);
  })

});
