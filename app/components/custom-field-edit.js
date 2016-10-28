import Ember from 'ember';

const {
  computed,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  field: null,
  i18n: Ember.inject.service(),

  actions: {
    addValue() {
      let fieldValues = this.get('fieldValues');
      fieldValues.addObject(Ember.Object.create());
    },

    deleteValue(valueToDelete) {
      let fieldValues = this.get('fieldValues');
      fieldValues.removeObject(valueToDelete);
    },

    selectType(fieldType) {
      this.get('field').set('type', fieldType);
    }
  },

  fieldTypeValues: [
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
        value: i18n.t(`components.customFieldEdit.labels.${fieldTypeId}`)
      };
    }).sort(function(a, b) {
      return Ember.compare(a.value.toString(), b.value.toString());
    });
  }),

  fieldValues: computed('field.type', function() {
    let field = this.get('field');
    let fieldName;
    let fieldValues;
    let type = field.get('type');
    if (type === 'checkbox') {
      fieldName = 'checkboxes';
    } else {
      fieldName = 'values';
    }
    fieldValues = field.get(fieldName);
    if (isEmpty(fieldValues)) {
      fieldValues = field.set(fieldName, []);
    }
    return fieldValues;
  }),

  showValues: computed('field.type', function() {
    let type = this.get('field.type');
    return (type === 'checkbox' || type === 'radio' || type === 'select');
  })

});
