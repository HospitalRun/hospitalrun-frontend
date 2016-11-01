import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

const {
  computed,
  isEmpty
} = Ember;

export default AbstractEditController.extend({
  currentForm: null,
  hideCancelButton: true,
  updateCapability: 'update_config',


  afterUpdate: function() {
    this.displayAlert(this.get('i18n').t('admin.address.titles.optionsSaved'), this.get('i18n').t('admin.address.messages.addressSaved'));
  },

  actions: {
    addForm() {
      let currentForm = this.store.createRecord('custom-form', {
        columns: 1,
        fields: [
        ]
      });
      this.set('currentForm', currentForm);
      return currentForm;
    },

    addField() {
      let newField = this.store.createRecord('custom-field');
      this.send('openModal', 'admin.custom-forms.field-edit', newField);
    },

    deleteField(field) {
      let currentForm = this.get('currentForm');
      currentForm.fields.removeObject(field);
    },

    editField(field) {
      if (isEmpty(field)) {
        field = this.store.createRecord('custom-field');
      }
      this.send('openModal', 'admin.custom-forms.field-edit', field);
    },

    selectForm(customFormId) {
      let model = this.get('model');
      let customForm = model.findBy('id', customFormId);
      this.set('currentForm', customForm);
    },

    updateField(field) {
      let currentForm = this.get('currentForm');
      if (field.get('isNew')) {
        let store = this.get('store');
        let changedAttributes = field.changedAttributes();
        let fieldAttributes = {};
        Object.keys(changedAttributes).forEach((attributeName) => {
          let [, newValue] = changedAttributes[attributeName];
          fieldAttributes[attributeName] = newValue;
        });
        let newField = store.push({
          data: {
            id:  uuid.v4(),
            type: 'custom-field',
            attributes: fieldAttributes
          }
        });
        let formFields = currentForm.get('fields');
        formFields.addObject(newField);
      }
      currentForm.save();
    }
  },

  formName: computed('currentForm.name', function() {
    let i18n = this.get('i18n');
    let formName = this.get('currentForm.name');
    if (isEmpty(formName)) {
      return i18n.t('admin.customForms.labels.newForm')
    } else {
      return formName;
    }
  }),

  fieldTypeLabel(fieldType) {
    let i18n = this.get('i18n');
    return i18n.t(`admin.customForms.labels.${fieldType}`);
  },

  showUpdateButton: computed('currentForm', function() {
    return !isEmpty(this.get('currentForm'));
  })
});
