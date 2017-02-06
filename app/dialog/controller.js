import Ember from 'ember';

const { computed, get, isEmpty } = Ember;

export default Ember.Controller.extend({
  showUpdateButton: true,
  isUpdateDisabled: false,

  cancelAction: computed('model.cancelAction', function() {
    let cancelAction = get(this, 'model.cancelAction');
    if (isEmpty(cancelAction)) {
      cancelAction = 'cancel';
    }
    return cancelAction;
  }),

  actions: {
    cancel() {
      this.send('closeModal');
    },

    confirm() {
      let confirmAction = this.getWithDefault('model.confirmAction', 'model.confirm');
      this.send(confirmAction, get(this, 'model'));
      this.send('closeModal');
    },

    ok() {
      let okAction = get(this, 'model.okAction');
      let okContext = get(this, 'model.okContext');
      if (isEmpty(okContext)) {
        okContext = get(this, 'model');
      }
      if (!isEmpty(okAction)) {
        this.send(okAction, okContext);
      }
      this.send('closeModal');
    }
  }
});
