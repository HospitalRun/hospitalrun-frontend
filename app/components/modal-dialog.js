import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
export default Component.extend({
  i18n: service(),
  cancelAction: 'cancel',
  closeModalAction: 'closeModal',
  hideCancelButton: false,
  hideUpdateButton: false,
  isUpdateDisabled: false,
  title: '',
  updateButtonAction: '',
  updateButtonClass: '',
  updateButtonText: '',
  cancelButtonText: '',
  cancelBtnText: function() {
    let cancelText = this.get('cancelButtonText');
    if (isEmpty(cancelText)) {
      return this.get('i18n').t('buttons.cancel');
    } else {
      return cancelText;
    }
  }.property('cancelButtonText'),
  actions: {
    cancelAction() {
      this.sendAction('cancelAction');
    },

    fireButtonAction(buttonAction) {
      this.set(buttonAction, buttonAction);
      this.sendAction(buttonAction);
    },

    updateAction() {
      this.sendAction('updateButtonAction');
    }

  },

  didInsertElement() {
    let $modal = this.$('.modal').modal();

    $modal.on('hidden.bs.modal', function() {
      this.sendAction('closeModalAction');
      this.sendAction('cancelAction');
    }.bind(this));
  },

  willDestroyElement() {
    let $modal = this.$('.modal');
    $modal.off('hidden.bs.modal');
    $modal.modal('hide');
    // jquery fixes
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
});
