import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import EmberObject, { set, get } from '@ember/object';

export default Service.extend({
  store: service(),

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
            set(model, `customForms.${get(customForm, 'id')}`, EmberObject.create());
          }
        });
      }
      return model;
    });
  }
});
