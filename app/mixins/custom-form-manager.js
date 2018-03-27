import Ember from 'ember';

export default Ember.Mixin.create({
  customForms: Ember.inject.service(),
  formType: null,
  formsForType: null,
  openModalAction: 'openModal',

  formsForSelect: Ember.computed('formsForType', 'usedForms', function() {
    let formsForType = this.get('formsForType');
    let usedForms = this.get('usedForms');
    if (!Ember.isEmpty(formsForType)) {
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

  formsToDisplay: Ember.computed('formsForType', 'model.customForms', function() {
    let formsForType = this.get('formsForType');
    let modelForms = this.get('model.customForms');
    if (!Ember.isEmpty(modelForms) && !Ember.isEmpty(formsForType)) {
      return Object.keys(modelForms).map((formId) => {
        return {
          form: formsForType.findBy('id', formId),
          propertyPrefix: `customForms.${formId}.`
        };
      });
    }
  }),

  showAddButton: Ember.computed('formsForSelect', function() {
    let formsForSelect = this.get('formsForSelect');
    return !Ember.isEmpty(formsForSelect);
  }),

  usedForms: Ember.computed('model.customForms', function() {
    let modelForms = this.get('model.customForms');
    if (Ember.isEmpty(modelForms)) {
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
