import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  needs: ['imaging'],
  chargePricingCategory: 'Imaging',
  chargeRoute: 'imaging.charge',
  selectedImagingType: null,

  canComplete: function() {
    var isNew = this.get('model.isNew'),
      imagingTypeName = this.get('model.imagingTypeName'),
      selectedImagingType = this.get('selectedImagingType');
    if (isNew && (Ember.isEmpty(imagingTypeName) || Ember.isArray(selectedImagingType) && selectedImagingType.length > 1)) {
      return false;
    } else {
      return this.currentUserCan('complete_imaging');
    }
  }.property('selectedImagingType.[]', 'model.imagingTypeName'),

  actions: {
    completeImaging: function() {
      this.set('status', 'Completed');
      this.get('model').validate();
      if (this.get('isValid')) {
        this.set('imagingDate', new Date());
        this.send('update');
      }
    },

    /**
     * Save the imaging request(s), creating multiples when user selects multiple imaging tests.
     */
    update: function() {
      if (this.get('isNew')) {
        var newImaging = this.get('model'),
          selectedImagingType = this.get('selectedImagingType');
        if (Ember.isEmpty(this.get('status'))) {
          this.set('status', 'Requested');
        }
        this.set('requestedBy', newImaging.getUserName());
        this.set('requestedDate', new Date());
        if (Ember.isEmpty(selectedImagingType)) {
          this.saveNewPricing(this.get('imagingTypeName'), 'Imaging', 'imagingType').then(function() {
            this.addChildToVisit(newImaging, 'imaging', 'Imaging').then(function() {
              this.saveModel();
            }.bind(this));
          }.bind(this));
        } else {
          this.getSelectedPricing('selectedImagingType').then(function(pricingRecords) {
            if (Ember.isArray(pricingRecords)) {
              this.createMultipleRequests(pricingRecords, 'imagingType', 'imaging', 'Imaging');
            } else {
              this.set('imagingType', pricingRecords);
              this.addChildToVisit(newImaging, 'imaging', 'Imaging').then(function() {
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
        buttonAction: 'completeImaging',
        buttonIcon: 'glyphicon glyphicon-ok',
        class: 'btn btn-primary on-white',
        buttonText: 'Complete'
      }];
    }
  }.property('canComplete', 'model.isValid'),

  lookupListsToUpdate: [{
    name: 'radiologistList',
    property: 'radiologist',
    id: 'radiologists'
  }],

  pricingTypeForObjectType: 'Imaging Procedure',
  pricingTypes: Ember.computed.alias('controllers.imaging.imagingPricingTypes'),

  pricingList: null, // This gets filled in by the route

  radiologistList: Ember.computed.alias('controllers.imaging.radiologistList'),

  updateCapability: 'add_imaging',

  afterUpdate: function(saveResponse, multipleRecords) {
    this.updateLookupLists();
    var afterDialogAction,
      alertTitle,
      alertMessage;
    if (this.get('status') === 'Completed') {
      alertTitle = 'Imaging Request Completed';
      alertMessage = 'The imaging request has been completed.';
    } else {
      alertTitle = 'Imaging Request Saved';
      alertMessage = 'The imaging request has been saved.';
    }
    if (multipleRecords) {
      afterDialogAction = this.get('cancelAction');
    }
    this.saveVisitIfNeeded(alertTitle, alertMessage, afterDialogAction);
    this.set('selectPatient', false);
  }

});
