import Ember from 'ember';

const {
  Service,
  get,
  inject,
  isEmpty,
  set
} = Ember;

export default Service.extend({
  store: inject.service(),

  getCustomForms(formTypes) {
    return this.get('store').query('custom-form', {
      options: {
        keys: formTypes
      },
      mapReduce: 'custom_form_by_type'
    });
  },

  setDefaultCustomForms(customFormNames, model) {
    return this.getCustomForms(customFormNames).then((customForms) => {
      if (!isEmpty(customForms)) {
        customForms.forEach((customForm) => {
          if (get(customForm, 'alwaysInclude')) {
            set(model, `customForms.${get(customForm, 'id')}`, Ember.Object.create());
          }
        });
      }
      return model;
    });
  }
});
