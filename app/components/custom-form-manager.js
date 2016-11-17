import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

const {
  computed,
  isEmpty
} = Ember;

export default Ember.Component.extend(SelectValues, {
  customForms: null,
  model: null,
  openModalAction: 'openModal',

  formsForSelect: computed('customForms', 'usedForms', function() {
    let customForms = this.get('customForms');
    let usedForms = this.get('usedForms');
    let formsForSelect = customForms.filter((customForm) => {
      return (!usedForms.includes(customForm.get('id')));
    });
    formsForSelect = formsForSelect.map((customForm) => {
      return {
        id: customForm.get('id'),
        value: customForm.get('name')
      };
    });
    return formsForSelect;
  }),

  formsToDisplay: computed('model.customForms', function() {
    let customForms = this.get('customForms');
    let modelForms = this.get('model.customForms');
    if (!isEmpty(modelForms)) {
      return Object.keys(modelForms).map((formId) => {
        return {
          form: customForms.findBy('id', formId),
          propertyPrefix: `customForms.${formId}.`
        };
      });
    }
  }),

  usedForms: computed('model.customForms', function() {
    let modelForms = this.get('model.customForms');
    if (isEmpty(modelForms)) {
      return [];
    } else {
      return Object.keys(modelForms);
    }
  }),

  showAddButton: computed('formsForSelect', function() {
    let formsForSelect = this.get('formsForSelect');
    return formsForSelect.length > 0;
  }),

  actions: {
    addForm() {
      let model = this.get('model');
      let formsForSelect = this.get('formsForSelect');
      this.sendAction('openModalAction', 'custom-form-add', Ember.Object.create({
        modelToAddTo: model,
        customForms: formsForSelect
      }));
    }
  }
});
