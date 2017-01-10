import Ember from 'ember';

const { computed } = Ember;

export default Ember.Mixin.create({

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
        value: i18n.t(`admin.customForms.labels.${fieldTypeId}`)
      };
    }).sort(function(a, b) {
      return Ember.compare(a.value.toString(), b.value.toString());
    });
  })
});
