import Ember from 'ember';
import BillingCategories from 'hospitalrun/mixins/billing-categories';
import LabPricingTypes from 'hospitalrun/mixins/lab-pricing-types';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ImagingPricingTypes from 'hospitalrun/mixins/imaging-pricing-types';
import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import UnitTypes from 'hospitalrun/mixins/unit-types';
import VisitTypes from 'hospitalrun/mixins/visit-types';
import { EKMixin, keyDown } from 'ember-keyboard';
export default Ember.Controller.extend(BillingCategories, EKMixin,
  ImagingPricingTypes, InventoryTypeList, LabPricingTypes, ModalHelper,
  UnitTypes, VisitTypes, {
    fileSystem: Ember.inject.service('filesystem'),
    lookupTypes: Ember.computed(function() {
      return [{
        name: this.get('i18n').t('admin.lookup.anesthesiaTypes'),
        value: 'anesthesia_types',
        model: {
          procedure: 'anesthesiaType'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.anesthesiologists'),
        value: 'anesthesiologists',
        model: {
          procedure: 'anesthesiologist'
        }
      }, {
        defaultValues: 'defaultBillingCategories',
        name: this.get('i18n').t('admin.lookup.billingCategories'),
        value: 'billing_categories',
        models: {
          'billing-line-item': 'category'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.clinicList'),
        value: 'clinic_list',
        models: { // Models that use this lookup -- use this later to update models on lookup changes
          patient: 'clinic'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.countryList'),
        value: 'country_list',
        models: {
          patient: 'country'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.diagnosisList'),
        value: 'diagnosis_list',
        models: {
          visit: 'primaryDiagnosis'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.cptCodeList'),
        value: 'cpt_code_list',
        models: {
          procedure: 'cptCode'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.expenseAccountList'),
        value: 'expense_account_list',
        models: {
          'inv-request': 'expenseAccount',
          pricing: 'expenseAccount'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.aisleLocationList'),
        value: 'aisle_location_list',
        models: {
          inventory: 'aisleLocation',
          'inv-location': 'aisleLocation',
          'inv-purchase': 'aisleLocation',
          'inv-request': [
            'deliveryAisle',
            'locationsAffected' // Special use case that we need to handle
          ]
        }
      }, {
        name: this.get('i18n').t('admin.lookup.warehouseList'),
        value: 'warehouse_list',
        models: {
          inventory: 'location',
          'inv-location': 'location',
          'inv-purchase': 'location',
          'inv-request': [
            'deliveryLocation',
            'locationsAffected' // Special use case that we need to handle
          ]
        }
      }, {
        defaultValues: 'defaultInventoryTypes',
        name: this.get('i18n').t('admin.lookup.inventoryTypes'),
        value: 'inventory_types',
        models: {
          inventory: 'inventoryType'
        }
      }, {
        defaultValues: 'defaultImagingPricingTypes',
        name: this.get('i18n').t('admin.lookup.imagingPricingTypes'),
        value: 'imaging_pricing_types',
        models: {
          pricing: 'pricingType'
        }
      }, {
        defaultValues: 'defaultLabPricingTypes',
        name: this.get('i18n').t('admin.lookup.labPricingTypes'),
        value: 'lab_pricing_types',
        models: {
          pricing: 'pricingType'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.patientStatusList'),
        value: 'patient_status_list',
        models: {
          patient: 'status'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.physicianList'),
        value: 'physician_list',
        models: {
          appointment: 'provider',
          visit: 'examiner',
          procedure: [
            'assistant',
            'physician'
          ]
        }
      }, {
        name: this.get('i18n').t('admin.lookup.procedureList'),
        value: 'procedure_list',
        models: {
          procedure: 'description'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.procedureLocations'),
        value: 'procedure_locations',
        models: {
          procedure: 'location'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.procedurePricingTypes'),
        value: 'procedure_pricing_types',
        models: {
          pricing: 'pricingType'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.radiologists'),
        value: 'radiologists',
        model: {
          imaging: 'radiologist'
        }
      }, {
        name: this.get('i18n').t('labels.sex'),
        value: 'sex',
        model: {
          patient: 'sex'
        }
      }, {
        defaultValues: 'defaultUnitList',
        name: this.get('i18n').t('admin.lookup.unitTypes'),
        value: 'unit_types',
        models: {
          inventory: 'distributionUnit',
          'inv-purchase': 'distributionUnit'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.vendorList'),
        value: 'vendor_list',
        models: {
          'inv-purchase': 'vendor'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.visitLocationList'),
        value: 'visit_location_list',
        models: {
          appointment: 'location',
          visit: 'location'
        }
      }, {
        defaultValues: 'defaultVisitTypes',
        name: this.get('i18n').t('admin.lookup.visitTypes'),
        value: 'visit_types',
        models: {
          visit: 'visitType'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.wardPricingTypes'),
        value: 'ward_pricing_types',
        models: {
          pricing: 'pricingType'
        }
      }];
    }),

    importFile: Ember.computed.alias('lookupTypeList.importFile'),

    lookupTitle: function() {
      let lookupType = this.get('model.lookupType');
      let lookupTypes = this.get('lookupTypes');
      let lookupDesc;
      if (!Ember.isEmpty(lookupType)) {
        lookupDesc = lookupTypes.findBy('value', lookupType);
        if (!Ember.isEmpty(lookupDesc)) {
          return lookupDesc.name;
        }
      }
    }.property('model.lookupType'),

    lookupTypeList: function() {
      let lookupType = this.get('model.lookupType');
      let lookupItem;
      if (!Ember.isEmpty(lookupType)) {
        lookupItem = this.get('model').findBy('id', lookupType);
        if (Ember.isEmpty(lookupItem) || !lookupItem.get('isLoaded')) {
          let defaultValues = [];
          let lookupTypes = this.get('lookupTypes');
          let lookupDesc = lookupTypes.findBy('value', lookupType);
          let store = this.get('store');
          if (!Ember.isEmpty(lookupDesc) && !Ember.isEmpty(lookupDesc.defaultValues)) {
            defaultValues = this.get(lookupDesc.defaultValues);
          }
          lookupItem = store.push(store.normalize('lookup', {
            id: lookupType,
            value: defaultValues
          }));
        }
        if (!Ember.isEmpty(lookupItem) && Ember.isEmpty(lookupItem.get('userCanAdd'))) {
          lookupItem.set('userCanAdd', true);
        }
        this.set('model.userCanAdd', lookupItem.get('userCanAdd'));
        this.set('model.organizeByType', lookupItem.get('organizeByType'));
        return lookupItem;
      }
    }.property('model.lookupType'),

    lookupTypeValues: function() {
      let values = this.get('lookupTypeList.value');
      if (!Ember.isEmpty(values)) {
        values.sort(this._sortValues);
      }
      return Ember.ArrayProxy.create({ content: Ember.A(values) });
    }.property('model.lookupType', 'lookupTypeList.value'),

    showOrganizeByType: function() {
      let lookupType = this.get('model.lookupType');
      return (!Ember.isEmpty(lookupType) && lookupType.indexOf('pricing_types') > 0);
    }.property('model.lookupType'),

    _canDeleteValue: function(value) {
      let lookupType = this.get('model.lookupType');
      switch (lookupType) {
        case 'inventory_types': {
          if (value === 'Medication') {
            this.displayAlert(
              this.get('i18n').t('admin.lookup.deleteValueInventoryTypeMedicationTitle'),
              this.get('i18n').t('admin.lookup.deleteValueInventoryTypeMedicationMessage')
            );
            return false;
          }
          break;
        }
        case 'lab_pricing_types': {
          if (value === 'Lab Procedure') {
            this.displayAlert(
              this.get('i18n').t('admin.lookup.deleteValueLabPricingTypeProcedureTitle'),
              this.get('i18n').t('admin.lookup.deleteValueLabPricingTypeProcedureMessage')
            );
            return false;
          }
          break;
        }
        case 'imaging_pricing_types': {
          if (value === 'Imaging Procedure') {
            this.displayAlert(
              this.get('i18n').t('admin.lookup.deleteValueImagingPricingTypeProcedureTitle'),
              this.get('i18n').t('admin.lookup.deleteValueImagingPricingTypeProcedureMessage')
            );
            return false;
          }
          break;
        }
        case 'visit_types': {
          if (value === 'Admission') {
            this.displayAlert(
              this.get('i18n').t('admin.lookup.deleteValueVisitTypeAdmissionTitle'),
              this.get('i18n').t('admin.lookup.deleteValueVisitTypeAdmissionMessage')
            );
            return false;
          } else if (value === 'Imaging') {
            this.displayAlert(
              this.get('i18n').t('admin.lookup.deleteValueVisitTypeImagingTitle'),
              this.get('i18n').t('admin.lookup.deleteValueVisitTypeImagingMessage')
            );
            return false;
          } else if (value === 'Lab') {
            this.displayAlert(
              this.get('i18n').t('admin.lookup.deleteValueVisitTypeLabTitle'),
              this.get('i18n').t('admin.lookup.deleteValueVisitTypeLabMessage')
            );
            return false;
          } else if (value === 'Pharmacy') {
            this.displayAlert(
              this.get('i18n').t('admin.lookup.deleteValueVisitTypePharmacyTitle'),
              this.get('i18n').t('admin.lookup.deleteValueVisitTypePharmacyMessage')
            );
            return false;
          }
        }
      }
      return true;
    },

    _sortValues: function(a, b) {
      return Ember.compare(a.toLowerCase(), b.toLowerCase());
    },

    activateKeyboard: Ember.on('init', function() {
      this.set('keyboardActivated', true);
    }),

    updateListKeyboard: Ember.on(keyDown('ctrl+KeyS'), keyDown('cmd+KeyS'), function(event) {
      this.send('updateList');
      event.preventDefault();
    }),

    actions: {
      addValue: function() {
        this.send('openModal', 'admin.lookup.edit', Ember.Object.create({
          isNew: true
        }));
      },
      deleteValue: function(value) {
        let lookupTypeList = this.get('lookupTypeList');
        let lookupTypeValues = lookupTypeList.get('value');
        if (this._canDeleteValue(value)) {
          lookupTypeValues.removeObject(value.toString());
          lookupTypeList.save();
        }
      },
      editValue: function(value) {
        if (!Ember.isEmpty(value)) {
          this.send('openModal', 'admin.lookup.edit', Ember.Object.create({
            isNew: false,
            originalValue: value.toString(),
            value: value.toString()
          }));
        }
      },
      importList: function() {
        let fileSystem = this.get('fileSystem');
        let fileToImport = this.get('importFile');
        let lookupTypeList = this.get('lookupTypeList');
        if (!fileToImport || !fileToImport.type) {
          this.displayAlert(
            this.get('i18n').t('admin.lookup.alertImportListTitle'),
            this.get('i18n').t('admin.lookup.alertImportListMessage')
          );
        } else {
          fileSystem.fileToDataURL(fileToImport).then(function(fileDataUrl) {
            let dataUrlParts = fileDataUrl.split(',');
            lookupTypeList.setProperties({
              _attachments: {
                file: {
                  content_type: fileToImport.type,
                  data: dataUrlParts[1]
                }
              },
              importFile: true
            });
            lookupTypeList.save().then(function() {
              this.displayAlert(
                this.get('i18n').t('admin.lookup.alertImportListSaveTitle'),
                this.get('i18n').t('admin.lookup.alertImportListSaveMessage'),
                'refreshLookupLists');
              this.set('importFile');
              this.set('model.importFileName');
            }.bind(this));
          }.bind(this));
        }
      },
      updateList: function() {
        let lookupTypeList = this.get('lookupTypeList');
        lookupTypeList.set('userCanAdd', this.get('model.userCanAdd'));
        lookupTypeList.set('organizeByType', this.get('model.organizeByType'));
        lookupTypeList.save().then(function() {
          this.displayAlert(
            this.get('i18n').t('admin.lookup.alertImportListUpdateTitle'),
            this.get('i18n').t('admin.lookup.alertImportListUpdateMessage')
          );
        }.bind(this));
      },
      updateValue: function(valueObject) {
        let updateList = false;
        let lookupTypeList = this.get('lookupTypeList');
        let lookupTypeValues = this.get('lookupTypeValues');
        let values = lookupTypeList.get('value');
        let value = valueObject.get('value');
        if (valueObject.get('isNew')) {
          updateList = true;
        } else {
          let originalValue = valueObject.get('originalValue');
          if (value !== originalValue) {
            lookupTypeValues.removeObject(originalValue);
            updateList = true;
            // TODO UPDATE ALL EXISTING DATA LOOKUPS (NODEJS JOB)
          }
        }
        if (updateList) {
          values.addObject(value);
          values = values.sort(this._sortValues);
          lookupTypeList.set('value', values);
          lookupTypeList.save().then(function(list) {
            // Make sure that the list on screen gets updated with the sorted items.
            let values = Ember.copy(list.get('value'));
            lookupTypeValues.clear();
            lookupTypeValues.addObjects(values);
          });

        }
      }
    }
  });
