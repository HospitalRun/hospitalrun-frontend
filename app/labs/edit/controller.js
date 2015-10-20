import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  needs: ['labs'],
  chargePricingCategory: 'Lab',
  chargeRoute: 'labs.charge',
  selectedLabType: null,

  canComplete: function() {
    var isNew = this.get('model.isNew'),
      labTypeName = this.get('model.labTypeName'),
      selectedLabType = this.get('selectedLabType');
    if (isNew && (Ember.isEmpty(labTypeName) || (Ember.isArray(selectedLabType) && selectedLabType.length > 1))) {
      return false;
    } else {
      return this.currentUserCan('complete_lab');
    }
  }.property('selectedLabType.[]', 'model.labTypeName'),

  actions: {
    completeLab: function() {
      this.set('status', 'Completed');
      this.get('model').validate();
      if (this.get('isValid')) {
        this.set('labDate', new Date());
        this.send('update');
      }
    },

    /**
     * Update the model and perform the before update and after update
     */
    update: function() {
      if (this.get('isNew')) {
        var newLab = this.get('model'),
          selectedLabType = this.get('selectedLabType');
        if (Ember.isEmpty(this.get('status'))) {
          this.set('status', 'Requested');
        }
        this.set('requestedBy', newLab.getUserName());
        this.set('requestedDate', new Date());
        if (Ember.isEmpty(selectedLabType)) {
          this.saveNewPricing(this.get('labTypeName'), 'Lab', 'labType').then(function() {
            this.addChildToVisit(newLab, 'labs', 'Lab').then(function() {
              this.saveModel();
            }.bind(this));
          }.bind(this));
        } else {
          this.getSelectedPricing('model.selectedLabType').then(function(pricingRecords) {
            if (Ember.isArray(pricingRecords)) {
              this.createMultipleRequests(pricingRecords, 'labType', 'labs', 'Lab');
            } else {
              this.set('labType', pricingRecords);
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
    var canComplete = this.get('canComplete'),
      isValid = this.get('model.isValid');
    if (isValid && canComplete) {
      return [{
        buttonAction: 'completeLab',
        buttonIcon: 'glyphicon glyphicon-ok',
        class: 'btn btn-primary on-white',
        buttonText: 'Complete'
      }];
    }
  }.property('canComplete', 'model.isValid'),

  pricingTypeForObjectType: 'Lab Procedure',
  pricingTypes: Ember.computed.alias('controllers.labs.labPricingTypes'),

  pricingList: null, // This gets filled in by the route

  updateCapability: 'add_lab',

  afterUpdate: function(saveResponse, multipleRecords) {
    var afterDialogAction,
      alertMessage,
      alertTitle;
    if (this.get('status') === 'Completed') {
      alertTitle = 'Lab Request Completed';
      alertMessage = 'The lab request has been completed.';
    } else {
      alertTitle = 'Lab Request Saved';
      alertMessage = 'The lab request has been saved.';
    }
    if (multipleRecords) {
      afterDialogAction = this.get('cancelAction');
    }
    this.saveVisitIfNeeded(alertTitle, alertMessage, afterDialogAction);
    this.set('selectPatient', false);
  }

});
