import { alias } from '@ember/object/computed';
import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  imagingController: controller('imaging'),

  chargePricingCategory: 'Imaging',
  selectedImagingType: null,

  canComplete: computed('selectedImagingType.[]', 'model.imagingTypeName', function() {
    let isNew = this.get('model.isNew');
    let imagingTypeName = this.get('model.imagingTypeName');
    let selectedImagingType = this.get('selectedImagingType');
    if (isNew && (isEmpty(imagingTypeName) || isArray(selectedImagingType) && selectedImagingType.length > 1)) {
      return false;
    } else {
      return this.currentUserCan('complete_imaging');
    }
  }),

  actions: {
    completeImaging() {
      this.set('model.status', 'Completed');
      this.set('model.completedBy', this.get('model').getUserName());
      this.get('model').validate().then(function() {
        if (this.get('model.isValid')) {
          this.set('model.imagingDate', new Date());
          this.send('update');
        }
      }.bind(this)).catch(function() {});
    },

    /**
     * Save the imaging request(s), creating multiples when user selects multiple imaging tests.
     */
    update() {
      if (this.get('model.isNew')) {
        let newImaging = this.get('model');
        let selectedImagingType = this.get('selectedImagingType');
        if (isEmpty(this.get('model.status'))) {
          this.set('model.status', 'Requested');
        }
        this.set('model.requestedBy', newImaging.getUserName());
        this.set('model.requestedDate', new Date());
        if (isEmpty(selectedImagingType)) {
          this.saveNewPricing(this.get('model.imagingTypeName'), 'Imaging', 'model.imagingType').then(function() {
            this.addChildToVisit(newImaging, 'imaging', 'Imaging').then(function() {
              this.saveModel();
            }.bind(this));
          }.bind(this));
        } else {
          this.getSelectedPricing('selectedImagingType').then(function(pricingRecords) {
            if (isArray(pricingRecords)) {
              this.createMultipleRequests(pricingRecords, 'imagingType', 'imaging', 'Imaging');
            } else {
              this.set('model.imagingType', pricingRecords);
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

  additionalButtons: computed('canComplete', 'model.isValid', function() {
    let i18n = this.get('i18n');
    let canComplete = this.get('canComplete');
    let isValid = this.get('model.isValid');
    if (isValid && canComplete) {
      return [{
        buttonAction: 'completeImaging',
        buttonIcon: 'glyphicon glyphicon-ok',
        class: 'btn btn-primary on-white',
        buttonText: i18n.t('buttons.complete')
      }];
    }
  }),

  lookupListsToUpdate: [{
    name: 'radiologistList',
    property: 'model.radiologist',
    id: 'radiologists'
  }],

  pricingTypes: alias('imagingController.imagingPricingTypes'),

  pricingList: null, // This gets filled in by the route

  radiologistList: alias('imagingController.radiologistList'),

  updateCapability: 'add_imaging',

  afterUpdate(saveResponse, multipleRecords) {
    let i18n = this.get('i18n');
    this.updateLookupLists();
    let afterDialogAction,
      alertTitle,
      alertMessage;
    if (this.get('model.status') === 'Completed') {
      alertTitle = i18n.t('imaging.alerts.completedTitle');
      alertMessage = i18n.t('imaging.alerts.completedMessage');
    } else {
      alertTitle = i18n.t('imaging.alerts.savedTitle');
      alertMessage = i18n.t('imaging.alerts.savedMessage');
    }
    if (multipleRecords) {
      afterDialogAction = this.get('cancelAction');
    }
    this.saveVisitIfNeeded(alertTitle, alertMessage, afterDialogAction);
    this.set('model.selectPatient', false);
  }

});
