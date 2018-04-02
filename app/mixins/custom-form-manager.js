import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  customForms: service(),
  formType: null,
  formsForType: null,
  openModalAction: 'openModal',

  formsForSelect: computed('formsForType', 'usedForms', function() {
    let formsForType = this.get('formsForType');
    let usedForms = this.get('usedForms');
    if (!isEmpty(formsForType)) {
      let formsForSelect = formsForType.filter((customForm) => {
        return (!usedForms.includes(customForm.get('id')));
      });
      formsForSelect = formsForSelect.map((customForm) => {
        return {
          id: customForm.get('id'),
          value: customForm.get('name')
        };
      });
      return formsForSelect;
    }
  }),

  formsToDisplay: computed('formsForType', 'model.customForms', function() {
    let formsForType = this.get('formsForType');
    let modelForms = this.get('model.customForms');
    if (!isEmpty(modelForms) && !isEmpty(formsForType)) {
      return Object.keys(modelForms).map((formId) => {
        return {
          form: formsForType.findBy('id', formId),
          propertyPrefix: `customForms.${formId}.`
        };
      });
    }
  }),

  showAddButton: computed('formsForSelect', function() {
    let formsForSelect = this.get('formsForSelect');
    return !isEmpty(formsForSelect);
  }),

  usedForms: computed('model.customForms', function() {
    let modelForms = this.get('model.customForms');
    if (isEmpty(modelForms)) {
      return [];
    } else {
      return Object.keys(modelForms);
    }
  }),

  initFormsForType() {
    let customForms = this.get('customForms');
    let formType = this.get('formType');

    customForms.getCustomForms([formType]).then((forms) => {
      if (!this.isDestroyed) {
        this.set('formsForType', forms);
      }
    });
  }
});
