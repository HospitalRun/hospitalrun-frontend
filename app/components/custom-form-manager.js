import EmberObject from '@ember/object';
import Component from '@ember/component';
import SelectValues from 'hospitalrun/utils/select-values';
import CustomFormManager from 'hospitalrun/mixins/custom-form-manager';

export default Component.extend(SelectValues, CustomFormManager, {
  model: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.initFormsForType();
  },

  actions: {
    addForm() {
      let model = this.get('model');
      let formsForSelect = this.get('formsForSelect');
      this.sendAction('openModalAction', 'custom-form-add', EmberObject.create({
        modelToAddTo: model,
        customForms: formsForSelect
      }));
    }
  }
});
