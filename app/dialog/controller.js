import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Controller.extend({
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
      let closeModalOnConfirm = this.getWithDefault('model.closeModalOnConfirm', true);
      let confirmAction = this.getWithDefault('model.confirmAction', 'model.confirm');
      this.send(confirmAction, get(this, 'model'));
      if (closeModalOnConfirm) {
        this.send('closeModal');
      }
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
