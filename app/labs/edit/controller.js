import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  labsController: Ember.inject.controller('labs'),
  chargePricingCategory: 'Lab',
  chargeRoute: 'labs.charge',
  selectedLabType: null,

  canComplete: function() {
    let isNew = this.get('model.isNew');
    let labTypeName = this.get('model.labTypeName');
    let selectedLabType = this.get('selectedLabType');
    if (isNew && (Ember.isEmpty(labTypeName) || (Ember.isArray(selectedLabType) && selectedLabType.length > 1))) {
      return false;
    } else {
      return this.currentUserCan('complete_lab');
    }
  }.property('selectedLabType.[]', 'model.labTypeName'),

  actions: {
    completeLab: function() {
      this.set('model.status', 'Completed');
      this.get('model').validate().then(function() {
        if (this.get('model.isValid')) {
          this.set('model.labDate', new Date());
          this.send('update');
        }
      }.bind(this)).catch(Ember.K);
    },

    /**
     * Update the model and perform the before update and after update
     */
    update: function() {
      if (this.get('model.isNew')) {
        let newLab = this.get('model');
        let selectedLabType = this.get('selectedLabType');
        if (Ember.isEmpty(this.get('model.status'))) {
          this.set('model.status', 'Requested');
        }
        this.set('model.requestedBy', newLab.getUserName());
        this.set('model.requestedDate', new Date());
        if (Ember.isEmpty(selectedLabType)) {
          this.saveNewPricing(this.get('model.labTypeName'), 'Lab', 'model.labType').then(function() {
            this.addChildToVisit(newLab, 'labs', 'Lab').then(function() {
              this.saveModel();
            }.bind(this));
          }.bind(this));
        } else {
          this.getSelectedPricing('selectedLabType').then(function(pricingRecords) {
            if (Ember.isArray(pricingRecords)) {
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

  additionalButtons: function() {
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
  }.property('canComplete', 'model.isValid'),

  pricingTypeForObjectType: 'Lab Procedure',
  pricingTypes: Ember.computed.alias('labsController.labPricingTypes'),

  pricingList: null, // This gets filled in by the route

  updateCapability: 'add_lab',

  afterUpdate: function(saveResponse, multipleRecords) {
    let i18n = this.get('i18n');
    let afterDialogAction, alertMessage, alertTitle;
    if (this.get('model.status') === 'Completed') {
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
  }

});
