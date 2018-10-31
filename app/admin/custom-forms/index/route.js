import EmberObject, { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-intl';

export default AbstractIndexRoute.extend(ModalHelper, UserSession, {
  newButtonAction: computed(function() {
    if (this.currentUserCan('update_config')) {
      return 'newItem';
    } else {
      return null;
    }
  }),
  newButtonText: t('admin.customForms.buttons.newForm'),

  pageTitle: computed('intl.locale', () => {
    return t('admin.customForms.titles.customForms');
  }),
  model() {
    let store = this.get('store');
    return store.findAll('custom-form');
  },

  actions: {
    deleteItem(item) {
      let intl = this.get('intl');
      let model = EmberObject.create({
        itemToDelete: item
      });
      let message = intl.t('messages.delete', { name: item.get('name') });
      let title = intl.t('admin.customForms.titles.deleteForm');
      this.displayConfirm(title, message, 'deleteCustomForm', model);
    },

    deleteCustomForm(model) {
      model.itemToDelete.set('archived', true);
      model.itemToDelete.save().then(()=> {
        model.itemToDelete.unloadRecord();
      });
    },

    editItem(item) {
      this.transitionTo('admin.custom-forms.edit', item);
    },

    newItem() {
      this.transitionTo('admin.custom-forms.edit', 'new');
    }

  }
});
