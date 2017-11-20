import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import EmberObject, { computed } from '@ember/object';
import { isEmpty, compare } from '@ember/utils';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
  editController: controller('admin/custom-forms/edit'),
  cancelAction: 'closeModal',
  i18n: service(),

  actions: {
    addValue() {
      let fieldValues = this.get('model.values');
      let fieldType = this.get('model.type');
      if (isEmpty(fieldValues)) {
        let model = this.get('model');
        fieldValues = [];
        model.set('values', fieldValues);
      }
      if (fieldType === 'header' && fieldValues.length < 1 || fieldType != 'header') {
        fieldValues.addObject(EmberObject.create());
      }
    },

    deleteValue(valueToDelete) {
      let fieldValues = this.get('model.values');
      fieldValues.removeObject(valueToDelete);
    },

    selectType(fieldType) {
      this.get('model').set('type', fieldType);
    },

    update() {
      this.get('editController').send('updateField', this.get('model'));
      this.send('closeModal');
    }
  },

  fieldTypeValues: [
    'header',
    'checkbox',
    'radio',
    'select',
    'text',
    'textarea'
  ],

  fieldTypes: computed(function() {
    let i18n = this.get('i18n');
    let fieldTypeValues = this.get('fieldTypeValues');
    return fieldTypeValues.map((fieldTypeId) => {
      return {
        id: fieldTypeId,
        value: i18n.t(`admin.customForms.labels.${fieldTypeId}`)
      };
    }).sort(function(a, b) {
      return compare(a.value.toString(), b.value.toString());
    });
  }),

  showValues: computed('model.type', function() {
    let type = this.get('model.type');
    return (type === 'checkbox' || type === 'radio' || type === 'select' || type === 'header');
  })

});
