import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import VisitTypes from 'hospitalrun/mixins/visit-types';

const { computed } = Ember;

export default AbstractEditController.extend(VisitTypes, {
  hideCancelButton: true,
  updateCapability: 'update_config',
  visitTypesList: computed.alias('model.visitTypesList'),

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
    let i18n = this.get('i18n');
    let visitTemplateIds = this.get('visitTemplateIds');
    return visitTemplateIds.map((currentId) => {
      return {
        id: currentId,
        value: i18n.t(`admin.visitForms.labels.${currentId}`)
      };
    });
  }),

  afterUpdate() {
    this.displayAlert(this.get('i18n').t('admin.address.titles.optionsSaved'), this.get('i18n').t('admin.address.messages.addressSaved'));
  },

  actions: {
    selectForm(visitType, event) {
      let visitForms = this.get('model.visitForms');
      visitForms[visitType] = event.target.value;
    }
  }
});
