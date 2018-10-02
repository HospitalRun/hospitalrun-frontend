import { alias } from '@ember/object/computed';
import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as controller } from '@ember/controller';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import { computed } from '@ember/object';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export const LAB_STATUS_COMPLETED = 'Completed';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  labsController: controller('labs'),
  chargePricingCategory: 'Lab',
  chargeRoute: 'labs.charge',
  selectedLabType: null,

  canComplete: computed('selectedLabType.[]', 'model.labTypeName', 'isCompleted', function() {
    let isNew = this.get('model.isNew');
    let labTypeName = this.get('model.labTypeName');
    let selectedLabType = this.get('selectedLabType');
    let isAlreadyCompleted = this.get('isCompleted');

    if (isNew && (isEmpty(labTypeName) || (isArray(selectedLabType) && selectedLabType.length > 1))) {
      return false;
    }

    return this.currentUserCan('complete_lab') && !isAlreadyCompleted;
  }),

  actions: {
    completeLab() {
      this.set('model.status', LAB_STATUS_COMPLETED);
      this.get('model').validate().then(function() {
        if (this.get('model.isValid')) {
          this.set('model.labDate', new Date());
          this.send('update');
        }
      }.bind(this)).catch(function() {});
    },

    /**
     * Update the model and perform the before update and after update
     */
    update() {
      if (this.get('model.isNew')) {
        let newLab = this.get('model');
        let selectedLabType = this.get('selectedLabType');
        if (isEmpty(this.get('model.status'))) {
          this.set('model.status', 'Requested');
        }
        this.set('model.requestedBy', newLab.getUserName());
        this.set('model.requestedDate', new Date());
        if (isEmpty(selectedLabType)) {
          this.saveNewPricing(this.get('model.labTypeName'), 'Lab', 'model.labType').then(function() {
            this.addChildToVisit(newLab, 'labs', 'Lab').then(function() {
              this.saveModel();
            }.bind(this));
          }.bind(this));
        } else {
          this.getSelectedPricing('selectedLabType').then(function(pricingRecords) {
            if (isArray(pricingRecords)) {
              this.createMultipleRequests(pricingRecords, 'labType', 'labs', 'Lab');
            } else {
              this.set('model.labType', pricingRecords);
              this.addChildToVisit(newLab, 'labs', 'Lab').then(function() {
                this.saveModel();
              }.bind(this));
            }
          }.bind(this));
        }
      } else {
        this.saveModel();
      }
    }
  },

  additionalButtons: computed('canComplete', 'model.isValid', function() {
    let canComplete = this.get('canComplete');
    let isValid = this.get('model.isValid');
    let i18n = this.get('i18n');
    if (isValid && canComplete) {
      return [{
        buttonAction: 'completeLab',
        buttonIcon: 'glyphicon glyphicon-ok',
        class: 'btn btn-primary on-white',
        buttonText: i18n.t('buttons.complete')
      }];
    }
  }),

  pricingTypeForObjectType: 'Lab Procedure',
  pricingTypes: alias('labsController.labPricingTypes'),

  pricingList: null, // This gets filled in by the route

  updateCapability: 'add_lab',

  afterUpdate(saveResponse, multipleRecords) {
    let i18n = this.get('i18n');
    let afterDialogAction, alertMessage, alertTitle;
    if (this.get('model.status') === LAB_STATUS_COMPLETED) {
      alertTitle = i18n.t('labs.alerts.requestCompletedTitle');
      alertMessage = i18n.t('labs.alerts.requestCompletedMessage');
    } else {
      alertTitle = i18n.t('labs.alerts.requestSavedTitle');
      alertMessage = i18n.t('labs.alerts.requestSavedMessage');
    }
    if (multipleRecords) {
      afterDialogAction = this.get('cancelAction');
    }
    this.saveVisitIfNeeded(alertTitle, alertMessage, afterDialogAction);
    this.set('model.selectPatient', false);
  },

  isCompleted: computed('model.status', function() {
    return (this.get('model.status') === LAB_STATUS_COMPLETED);
  }),

  showUpdateButton: computed('isCompleted', function() {
    return this.get('isCompleted') ? false : this._super();
  })
});
