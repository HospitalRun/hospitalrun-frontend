import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend(IsUpdateDisabled, {
  patientsEdit: Ember.inject.controller('patients/edit'),
  editController: Ember.computed.alias('patientsEdit'),
  title: t('patients.titles.add_contact'),
  updateButtonText: t('buttons.add'),
  updateButtonAction: 'add',
  showUpdateButton: true,

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    add: function() {
      let newContact = this.getProperties('name', 'phone', 'email', 'relationship');
      this.get('editController').send('addContact', newContact);
    }
  }
});
