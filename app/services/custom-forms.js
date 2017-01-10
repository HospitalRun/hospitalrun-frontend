import Ember from 'ember';

const {
  isEmpty,
  set
} = Ember;

export default Ember.Service.extend({
  store: Ember.inject.service(),
  customForms: {},
  getCustomForms(formTypes) {
    let customForms = this.get('customForms');
    let store = this.get('store');
    let formTypesToQuery = formTypes.filter(function(formType) {
      if (isEmpty(customForms[formType])) {
        return true;
      }
    });
    if (isEmpty(formTypesToQuery)) {
      return Ember.RSVP.resolve(this._getCustomFormsFromCache(formTypes));
    } else {
      return store.query('custom-form', {
        options: {
          keys: formTypesToQuery
        },
        mapReduce: 'custom_form_by_type'
      }).then((forms) => {
        formTypesToQuery.forEach((formType) => {
          customForms[formType] = forms.filterBy('formType', formType);
        });
        return this._getCustomFormsFromCache(formTypes);
      });
    }
  },

  _getCustomFormsFromCache(formTypes) {
    let customForms = this.get('customForms');
    let returnForms = [];
    formTypes.forEach((formType) => {
      returnForms.addObjects(customForms[formType]);
    });
    return returnForms;
  },

  resetCustomFormByType(formType) {
    let customForms = this.get('customForms');
    delete customForms[formType];
  },

  setDefaultCustomForms(customFormNames, model) {
    return this.getCustomForms(customFormNames).then((customForms) => {
      if (!isEmpty(customForms)) {
        customForms.forEach((customForm) => {
          if (customForm.get('alwaysInclude')) {
            set(model, `customForms.${customForm.get('id')}`, Ember.Object.create());
          }
        });
      }
    });
  }

});
