import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

const {
  get,
  set,
  computed,
  computed: {
    alias
  }
} = Ember;

export default AbstractEditController.extend(PatientSubmodule, PatientDiagnosis, PouchDbMixin, {
  queryParams: ['print'],
  print: null,

  lookupListsToUpdate: [{
    name: 'physicianList',
    property: 'model.surgeon',
    id: 'physician_list'
  }],

  visitsController: Ember.inject.controller('visits'),

  physicianList: alias('visitsController.physicianList'),

  logoURL: alias('visitsController.printHeader.value.logoURL'),
  facilityName: alias('visitsController.printHeader.value.facilityName'),
  headerLine1: alias('visitsController.printHeader.value.headerLine1'),
  headerLine2: alias('visitsController.printHeader.value.headerLine2'),
  headerLine3: alias('visitsController.printHeader.value.headerLine3'),

  diagnosisList: alias('visitsController.diagnosisList'),

  additionalButtons: computed('model.isNew', function() {
    let isNew = get(this, 'model.isNew');
    let i18n = get(this, 'i18n');
    if (!isNew) {
      return [{
        class: 'btn btn-primary on-white',
        buttonAction: 'printReport',
        buttonIcon: 'octicon octicon-check',
        buttonText: i18n.t('labels.print')
      }];
    }
  }),

  updateCapability: 'add_report',

  beforeUpdate() {
    return new Ember.RSVP.Promise((resolve) => {
      let model = get(this, 'model');
      if (get(model, 'isNew')) {
        if (get(this, 'model.visit.outPatient')) {
          set(model, 'reportType', 'OPD Report');
        } else {
          set(model, 'reportType', 'Discharge Report');
        }
      }
      resolve();
    });
  },

  afterUpdate() {
    let alertTitle = get(this, 'i18n').t('reports.titles.saved');
    let alertMessage = get(this, 'i18n').t('reports.messages.saved');
    this.saveVisitIfNeeded(alertTitle, alertMessage);
    let opdTitle = get(this, 'i18n').t('reports.titles.opdReport');
    let dischargeTitle = get(this, 'i18n').t('reports.titles.dischargeReport');
    let editTitle = get(this, 'model.visit.outPatient') ? opdTitle : dischargeTitle;
    let sectionDetails = {};
    sectionDetails.currentScreenTitle = editTitle;
    this.send('setSectionHeader', sectionDetails);
  },

  actions: {
    printReport() {
      window.print();
    }
  }

});
