import EmberObject, { computed } from '@ember/object';
import { isEmpty, compare } from '@ember/utils';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import uuid from 'uuid';

export default AbstractEditController.extend({
  preview: false,
  previewModel: EmberObject.create(),
  updateCapability: 'update_config',

  afterUpdate() {
    this.displayAlert(
      this.get('intl').t('admin.customForms.titles.formSaved'),
      this.get('intl').t('admin.customForms.messages.formSaved', { name: this.get('model.shortDisplayName') })
    );
  },

  actions: {
    addField() {
      let newField = this.store.createRecord('custom-field');
      this.send('openModal', 'admin.custom-forms.field-edit', newField);
    },

    deleteField(field) {
      let fields = this.get('model.fields');
      fields.removeObject(field);
    },

    editField(field) {
      if (isEmpty(field)) {
        field = this.store.createRecord('custom-field');
      }
      this.send('openModal', 'admin.custom-forms.field-edit', field);
    },

    moveFieldDown(field) {
      let fields = this.get('model.fields');
      let currentFieldIdx = fields.indexOf(field);
      let nextField = fields.objectAt(currentFieldIdx + 1);
      fields.replace(currentFieldIdx, 2, [nextField, field]);
    },

    moveFieldUp(field) {
      let fields = this.get('model.fields');
      let previousFieldIdx = (fields.indexOf(field) - 1);
      let previousField = fields.objectAt(previousFieldIdx);
      fields.replace(previousFieldIdx, 2, [field, previousField]);
    },

    togglePreview() {
      this.toggleProperty('preview');
    },

    updateField(field) {
      if (field.get('isNew')) {
        this._addNewField(field);
      }
      this.get('model').save();
    }
  },

  formName: computed('model.name', function() {
    let intl = this.get('intl');
    let formName = this.get('model.name');
    if (isEmpty(formName)) {
      return intl.t('admin.customForms.labels.newForm');
    } else {
      return formName;
    }
  }),

  formTypeValues: [
    'incident',
    'operativePlan',
    'patient',
    'socialwork',
    'visit',
    'opdReport',
    'dischargeReport',
    'lab'
  ],

  formTypes: computed(function() {
    let intl = this.get('intl');
    let formTypeValues = this.get('formTypeValues');
    return formTypeValues.map((formTypeId) => {
      return {
        id: formTypeId,
        value: intl.t(`admin.customForms.labels.${formTypeId}FormType`)
      };
    }).sort(function(a, b) {
      return compare(a.value.toString(), b.value.toString());
    });
  }),

  lastFieldIndex: computed('model.fields.length', function() {
    return this.get('model.fields.length') - 1;
  }),

  fieldTypeLabel(fieldType) {
    let intl = this.get('intl');
    return intl.t(`admin.customForms.labels.${fieldType}`);
  },

  _addNewField(field) {
    let changedAttributes = field.changedAttributes();
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
        id: uuid.v4(),
        type: 'custom-field',
        attributes: fieldAttributes
      }
    });
    let formFields = this.get('model.fields');
    formFields.addObject(newField);
  },

  _generatePropertyNames(field) {
    let type = field.get('type');
    let propertyName = this._getPropertyName(field);
    if (type === 'checkbox') {
      let values = field.get('values');
      values.forEach((value, index) => {
        value.set('property',  `${propertyName}${(index + 1)}`);
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
    let fields = this.get('model.fields');
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
