import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import EmberObject, { get } from '@ember/object';
import SelectValues from 'hospitalrun/utils/select-values';

export default Component.extend(SelectValues, {
  customForms: service(),
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
      this.sendAction('openModalAction', 'custom-form-add', EmberObject.create({
        modelToAddTo: model,
        customForms: formsForSelect
      }));
    }
  }
});
