import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

const {
  computed,
  isEmpty
} = Ember;

export default AbstractEditController.extend({
  currentForm: null,
  hideCancelButton: true,
  preview: false,
  previewModel: Ember.Object.create(),
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
      let fields = this.get('currentForm.fields');
      fields.removeObject(field);
    },

    editField(field) {
      if (isEmpty(field)) {
        field = this.store.createRecord('custom-field');
      }
      this.send('openModal', 'admin.custom-forms.field-edit', field);
    },

    moveFieldDown(field) {
      let fields = this.get('currentForm.fields');
      let currentFieldIdx = fields.indexOf(field);
      let nextField = fields.objectAt(currentFieldIdx+1);
      fields.replace(currentFieldIdx, 2, [nextField, field]);
    },

    moveFieldUp(field) {
      let fields = this.get('currentForm.fields');
      let previousFieldIdx = (fields.indexOf(field) -1);
      let previousField = fields.objectAt(previousFieldIdx);
      fields.replace(previousFieldIdx, 2, [field, previousField]);
    },

    selectForm(customFormId) {
      let model = this.get('model');
      let customForm = model.findBy('id', customFormId);
      this.set('currentForm', customForm);
    },

    togglePreview() {
      this.toggleProperty('preview');
    },

    updateField(field) {
      let currentForm = this.get('currentForm');
      if (field.get('isNew')) {
        this._addNewField(field);
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

  formTypeValues: [
    'patient',
    'visit'
  ],

  formTypes: computed(function() {
    let i18n = this.get('i18n');
    let formTypeValues = this.get('formTypeValues');
    return formTypeValues.map((formTypeId) => {
      return {
        id: formTypeId,
        value: i18n.t(`admin.customForms.labels.${formTypeId}FormType`)
      };
    }).sort(function(a, b) {
      return Ember.compare(a.value.toString(), b.value.toString());
    });
  }),

  lastFieldIndex: computed('currentForm.fields.length', function() {
    return this.get('currentForm.fields.length') - 1;
  }),

  fieldTypeLabel(fieldType) {
    let i18n = this.get('i18n');
    return i18n.t(`admin.customForms.labels.${fieldType}`);
  },

  showUpdateButton: computed('currentForm', function() {
    return !isEmpty(this.get('currentForm'));
  }),

  _addNewField(field) {
    let changedAttributes = field.changedAttributes();
    let currentForm = this.get('currentForm');
    let fieldAttributes = {};
    let store = this.get('store');
    this._generatePropertyNames(field);
    Object.keys(changedAttributes).forEach((attributeName) => {
      let [, newValue] = changedAttributes[attributeName];
      fieldAttributes[attributeName] = newValue;
    });
    fieldAttributes.property = field.get('property');
    let newField = store.push({
      data: {
        id:  uuid.v4(),
        type: 'custom-field',
        attributes: fieldAttributes
      }
    });
    let formFields = currentForm.get('fields');
    formFields.addObject(newField);
  },

  _generatePropertyNames(field) {
    let type = field.get('type');
    let propertyName = this._getPropertyName(field);
    if (type === 'checkbox') {
      let values = field.get('values');
      values.forEach((value, index) => {
        value.set('property',  `${propertyName}${(index+1)}`);
      });
    } else {
      field.set('property', propertyName);
    }
  },

  _getPropertyName(field) {
    let camelizedLabel = field.get('label').camelize();
    let labelIndex = 1;
    let propertyName = camelizedLabel;
    while (this._isPropertyUsed(propertyName) && labelIndex < 10) {
      propertyName = `${camelizedLabel}${++labelIndex}`;
    }
    return propertyName;
  },

  _isPropertyUsed(propertyName) {
    let fields = this.get('currentForm.fields');
    let existingProperty = fields.findBy('property', propertyName);
    if (!isEmpty(existingProperty)) {
      return true;
    } else {
      let checkboxes = fields.filterBy('type', 'checkbox');
      return checkboxes.any((checkbox) =>{
        existingProperty = checkbox.get('values').findBy('property', propertyName);
        if (!isEmpty(existingProperty)) {
          return true;
        }
      });
    }
  }

});
