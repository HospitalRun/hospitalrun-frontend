import Ember from 'ember';
import BillingCategories from 'hospitalrun/mixins/billing-categories';
import csvParse from 'npm:csv-parse';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import UnitTypes from 'hospitalrun/mixins/unit-types';
import VisitTypes from 'hospitalrun/mixins/visit-types';
import { EKMixin, keyDown } from 'ember-keyboard';

const {
  computed, get, inject
} = Ember;

export default Ember.Controller.extend(BillingCategories, EKMixin,
  InventoryTypeList, ModalHelper, UnitTypes, VisitTypes, {
    fileSystem: inject.service('filesystem'),
    lookupLists: inject.service(),

    canEditValues: computed('model.lookupType', function() {
      let lookupType = this.get('model.lookupType');
      return (lookupType !== 'imaging_pricing_types' && lookupType !== 'lab_pricing_types');
    }),

    lookupTypes: computed(function() {
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
          diagnosis: 'diagnosis'
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
        name: this.get('i18n').t('admin.lookup.incidentDepartments'),
        value: 'incident_departments',
        models: {
          incident: 'department'
        }
      }, {
        defaultValues: 'defaultInventoryTypes',
        name: this.get('i18n').t('admin.lookup.inventoryTypes'),
        value: 'inventory_types',
        models: {
          inventory: 'inventoryType'
        }
      }, {
        name: this.get('i18n').t('admin.lookup.imagingPricingTypes'),
        value: 'imaging_pricing_types',
        models: {
          pricing: 'pricingType'
        }
      }, {
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

    importFile: computed.alias('lookupTypeList.importFile'),

    lookupTitle: computed('model.lookupType', function() {
      let lookupType = this.get('model.lookupType');
      let lookupTypes = this.get('lookupTypes');
      let lookupDesc;
      if (!Ember.isEmpty(lookupType)) {
        lookupDesc = lookupTypes.findBy('value', lookupType);
        if (!Ember.isEmpty(lookupDesc)) {
          return lookupDesc.name;
        }
      }
    }),

    lookupTypeList: computed('model.lookupType', function() {
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
        return lookupItem;
      }
    }),

    lookupTypeValues: computed('model.lookupType', 'lookupTypeList.value.[]', function() {
      let lookupType = this.get('model.lookupType');
      let values = this.get('lookupTypeList.value');
      if (!Ember.isEmpty(values)) {
        values.sort(this._sortValues);
        values = values.map((value) => {
          return {
            canModify: this._canModifyValue(value, lookupType),
            value
          };
        });
      }
      return Ember.ArrayProxy.create({ content: Ember.A(values) });
    }),

    showOrganizeByType: computed('model.lookupType', function() {
      let lookupType = this.get('model.lookupType');
      return (!Ember.isEmpty(lookupType) && lookupType.indexOf('pricing_types') > 0);
    }),

    _canModifyValue(value, lookupType) {
      switch (lookupType) {
        case 'inventory_types': {
          if (value === 'Medication') {
            return false;
          }
          break;
        }
        case 'lab_pricing_types': {
          if (value === 'Lab Procedure') {
            return false;
          }
          break;
        }
        case 'imaging_pricing_types': {
          if (value === 'Imaging Procedure') {
            return false;
          }
          break;
        }
        case 'visit_types': {
          if (value === 'Admission') {
            return false;
          } else if (value === 'Imaging') {
            return false;
          } else if (value === 'Lab') {
            return false;
          } else if (value === 'Pharmacy') {
            return false;
          }
        }
      }
      return true;
    },

    _importLookupList(file) {
      let fileSystem = get(this, 'fileSystem');
      let lookupTypeList = get(this, 'lookupTypeList');
      let lookupValues = get(lookupTypeList, 'value');
      fileSystem.fileToString(file).then((values) => {
        csvParse(values, { trim: true }, (err, data) =>{
          data.forEach((row) => {
            let [newValue] = row;
            if (!lookupValues.includes(newValue)) {
              lookupValues.addObject(newValue);
            }
          });
          lookupValues.sort();
          let i18n = get(this, 'i18n');
          let message = i18n.t('admin.lookup.alertImportListSaveMessage');
          let title = i18n.t('admin.lookup.alertImportListSaveTitle');
          lookupTypeList.save().then(() => {
            let lookupLists = get(this, 'lookupLists');
            lookupLists.resetLookupList(get(lookupTypeList, 'id'));
            this.displayAlert(title, message);
            this.set('importFile');
            this.set('model.importFileName');
          });
        });
      });
    },

    _sortValues(a, b) {
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
      addValue() {
        this.send('openModal', 'admin.lookup.edit', Ember.Object.create({
          isNew: true
        }));
      },
      confirmDeleteValue(value) {
        let i18n = this.get('i18n');
        let title = i18n.t('admin.lookup.titles.deleteLookupValue');
        let message = i18n.t('admin.lookup.messages.deleteLookupValue', { value });
        this.displayConfirm(title, message, 'deleteValue', Ember.Object.create({
          valueToDelete: value
        }));
      },
      deleteValue(value) {
        let lookupTypeList = this.get('lookupTypeList');
        let lookupTypeValues = lookupTypeList.get('value');
        let valueToDelete = value.get('valueToDelete');
        lookupTypeValues.removeObject(valueToDelete.toString());
        lookupTypeList.save();
      },
      editValue(value) {
        if (!Ember.isEmpty(value)) {
          this.send('openModal', 'admin.lookup.edit', Ember.Object.create({
            isNew: false,
            originalValue: value.toString(),
            value: value.toString()
          }));
        }
      },
      importList() {
        let fileToImport = this.get('importFile');
        if (!fileToImport || !fileToImport.type) {
          this.displayAlert(
            this.get('i18n').t('admin.lookup.alertImportListTitle'),
            this.get('i18n').t('admin.lookup.alertImportListMessage')
          );
        } else {
          this._importLookupList(fileToImport);
        }
      },
      updateList() {
        let lookupTypeList = this.get('lookupTypeList');
        lookupTypeList.save().then(() => {
          let lookupLists = get(this, 'lookupLists');
          lookupLists.resetLookupList(get(lookupTypeList, 'id'));
          this.displayAlert(
            this.get('i18n').t('admin.lookup.alertImportListUpdateTitle'),
            this.get('i18n').t('admin.lookup.alertImportListUpdateMessage')
          );
        });
      },
      updateValue(valueObject) {
        let updateList = false;
        let lookupTypeList = this.get('lookupTypeList');
        let values = lookupTypeList.get('value');
        let value = valueObject.get('value');
        if (valueObject.get('isNew')) {
          updateList = true;
        } else {
          let originalValue = valueObject.get('originalValue');
          if (value !== originalValue) {
            values.removeObject(originalValue);
            updateList = true;
            // TODO UPDATE ALL EXISTING DATA LOOKUPS (NODEJS JOB)
          }
        }
        if (updateList) {
          values.addObject(value);
          values = values.sort(this._sortValues);
          lookupTypeList.set('value', values);
          this.send('updateList');
        }
      }
    }
  });
