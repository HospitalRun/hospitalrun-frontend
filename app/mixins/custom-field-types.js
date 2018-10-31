import { compare } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({

  fieldTypeValues: [
    'checkbox',
    'radio',
    'select',
    'text',
    'textarea'
  ],

  fieldTypes: computed(function() {
    let intl = this.get('intl');
    let fieldTypeValues = this.get('fieldTypeValues');
    return fieldTypeValues.map((fieldTypeId) => {
      return {
        id: fieldTypeId,
        value: i18n.t(`admin.customForms.labels.${fieldTypeId}`)
      };
    }).sort(function(a, b) {
      return compare(a.value.toString(), b.value.toString());
    });
  })
});
