import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import { t } from 'hospitalrun/macro';

export default Controller.extend(IsUpdateDisabled, {
  patientsEdit: controller('patients/edit'),
  editController: alias('patientsEdit'),
  title: t('patients.titles.addContact'),
  updateButtonText: t('buttons.add'),
  updateButtonAction: 'add',
  showUpdateButton: true,

  actions: {
    cancel() {
      this.send('closeModal');
    },

    add() {
      let newContact = this.getProperties('name', 'phone', 'email', 'relationship');
      this.get('editController').send('addContact', newContact);
      this.setProperties({ name: '', phone: '', email: '', relationship: '' });
    }
  }
});
