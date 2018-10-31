import { alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import SelectValues from 'hospitalrun/utils/select-values';
import { translationMacro as t } from 'ember-intl';
import { computed } from '@ember/object';

export default Controller.extend(IsUpdateDisabled, {
  patientsController: controller('patients'),

  categoryTypes: [
    'Clothing',
    'Education',
    'Electricity',
    'Food',
    'Fuel',
    'Other',
    'Rent',
    'Transportation',
    'Water'
  ].map(SelectValues.selectValuesMap),

  editController: alias('patientsController'),
  showUpdateButton: true,
  title: t('patients.titles.socialWork'),
  updateButtonAction: 'update',

  updateButtonText: computed('model.isNew', function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('intl').t('buttons.add');
    } else {
      return this.get('intl').t('buttons.update');
    }
  }),

  actions: {
    cancel() {
      this.send('closeModal');
    },

    update() {
      let model = this.get('model');
      this.get('editController').send('updateExpense', model);
    }
  }
});
