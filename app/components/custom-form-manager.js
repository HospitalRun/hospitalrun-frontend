import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

const {
  computed,
  isEmpty
} = Ember;

export default Ember.Component.extend(SelectValues, {
  customForms: Ember.inject.service(),
  formType: null,
  formsForType: null,
  model: null,
  openModalAction: 'openModal',

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    let customForms = this.get('customForms');
    let formType = this.get('formType');
    customForms.getCustomForms([formType]).then((forms) => {
      let isDestroyed = this.get('isDestroyed');
      if (!isDestroyed) {
        this.set('formsForType', forms);
      }
    });
  },

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
    return !isEmpty(formsForSelect);
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
