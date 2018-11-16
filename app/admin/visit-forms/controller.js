import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(VisitTypes, {
  hideCancelButton: true,
  updateCapability: 'update_config',
  visitTypesList: alias('model.visitTypesList'),

  visitFormsForEditing: computed('model.visitForms', 'visitTypes', function() {
    let visitForms = this.get('model.visitForms');
    let visitTypes = this.get('visitTypes');

    let editList = visitTypes.map((visitType) => {
      if (!visitForms[visitType.value]) {
        visitForms[visitType.value] = 'initial';
      }
      return {
        type: visitType.value,
        form: visitForms[visitType.value]
      };
    });
    return editList;
  }),

  visitTemplateIds: ['initial', 'followup'],

  visitTemplates: computed(function() {
    let intl = this.get('intl');
    let visitTemplateIds = this.get('visitTemplateIds');
    return visitTemplateIds.map((currentId) => {
      return {
        id: currentId,
        value: intl.t(`admin.visitForms.labels.${currentId}`)
      };
    });
  }),

  afterUpdate() {
    this.displayAlert(this.get('intl').t('admin.address.titles.optionsSaved'), this.get('intl').t('admin.address.messages.addressSaved'));
  },

  actions: {
    selectForm(visitType, event) {
      let visitForms = this.get('model.visitForms');
      visitForms[visitType] = event.target.value;
    }
  }
});
