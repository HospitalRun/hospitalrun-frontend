import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

const {
  Component,
  computed: {
    alias
  },
  get,
  inject
} = Ember;

export default Component.extend(SelectValues, {
  customForms: inject.service(),
  formType: null,
  formsForType: null,
  model: null,
  openModalAction: 'openModal',

  formsForSelect: alias('customForms.formsForSelect'),
  formsToDisplay: alias('customForms.formsToDisplay'),
  showAddButton: alias('customForms.showAddButton'),

  didReceiveAttrs(/* attrs */) {
    this._super(...arguments);
    let customForms = get(this, 'customForms');
    let formType = get(this, 'formType');
    let model = get(this, 'model');
    customForms.setupForms(formType, model);
  },

  actions: {
    addForm() {
      let model = get(this, 'model');
      let formsForSelect = get(this, 'formsForSelect');
      this.sendAction('openModalAction', 'custom-form-add', Ember.Object.create({
        modelToAddTo: model,
        customForms: formsForSelect
      }));
    }
  }
});
