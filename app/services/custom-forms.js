import Ember from 'ember';

const {
  Service,
  computed,
  get,
  inject,
  isEmpty,
  set
} = Ember;

export default Service.extend({
  currentModel: null,
  customForms: {},
  formsForType: null,
  store: inject.service(),

  formsForSelect: computed('formsForType', 'usedForms', function() {
    let formsForType = get(this, 'formsForType');
    let usedForms = get(this, 'usedForms');
    if (!isEmpty(formsForType)) {
      let formsForSelect = formsForType.filter((customForm) => {
        return (!usedForms.includes(get(customForm, 'id')));
      });
      formsForSelect = formsForSelect.map((customForm) => {
        return {
          id: get(customForm, 'id'),
          value: get(customForm, 'name')
        };
      });
      return formsForSelect;
    }
  }),

  formsToDisplay: computed('formsForType', 'currentModel.customForms', function() {
    let formsForType = get(this, 'formsForType');
    let modelForms = get(this, 'currentModel.customForms');
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
    let formsForSelect = get(this, 'formsForSelect');
    return !isEmpty(formsForSelect);
  }),

  usedForms: computed('currentModel.customForms', function() {
    let modelForms = get(this, 'currentModel.customForms');
    if (isEmpty(modelForms)) {
      return [];
    } else {
      return Object.keys(modelForms);
    }
  }),

  getCustomForms(formTypes) {
    let customForms = get(this, 'customForms');
    let store = get(this, 'store');
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

  resetCustomFormByType(formType) {
    let customForms = get(this, 'customForms');
    delete customForms[formType];
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
  },

  setupForms(formType, model) {
    this.getCustomForms([formType]).then((forms) => {
      set(this, 'currentModel', model);
      set(this, 'formsForType', forms);
    });
  },

  _getCustomFormsFromCache(formTypes) {
    let customForms = get(this, 'customForms');
    let returnForms = [];
    formTypes.forEach((formType) => {
      returnForms.addObjects(customForms[formType]);
    });
    return returnForms;
  }

});
