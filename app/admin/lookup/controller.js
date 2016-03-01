import Ember from 'ember';
import BillingCategories from 'hospitalrun/mixins/billing-categories';
import LabPricingTypes from 'hospitalrun/mixins/lab-pricing-types';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ImagingPricingTypes from 'hospitalrun/mixins/imaging-pricing-types';
import IncidentLocationsList from 'hospitalrun/mixins/incident-locations-list';
import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import UnitTypes from 'hospitalrun/mixins/unit-types';
import VisitTypes from 'hospitalrun/mixins/visit-types';
export default Ember.Controller.extend(BillingCategories, LabPricingTypes,
  ModalHelper, ImagingPricingTypes, IncidentLocationsList, InventoryTypeList,  UnitTypes, VisitTypes, {
    fileSystem: Ember.inject.service('filesystem'),
    lookupTypes: [{
      name: 'Anesthesia Types',
      value: 'anesthesia_types',
      model: {
        procedure: 'anesthesiaType'
      }
    }, {
      name: 'Anesthesiologists',
      value: 'anesthesiologists',
      model: {
        procedure: 'anesthesiologist'
      }
    }, {
      defaultValues: 'defaultBillingCategories',
      name: 'Billing Categories',
      value: 'billing_categories',
      models: {
        'billing-line-item': 'category'
      }
    }, {
      name: 'Clinic Locations',
      value: 'clinic_list',
      models: { // Models that use this lookup -- use this later to update models on lookup changes
        patient: 'clinic'
      }
    }, {
      name: 'Countries',
      value: 'country_list',
      models: {
        patient: 'country'
      }
    }, {
      name: 'Diagnoses',
      value: 'diagnosis_list',
      models: {
        visit: 'primaryDiagnosis'
      }
    }, {
      name: 'CPT Codes',
      value: 'cpt_code_list',
      models: {
        procedure: 'cptCode'
      }
    }, {
      name: 'Expense Accounts',
      value: 'expense_account_list',
      models: {
        'inv-request': 'expenseAccount',
        pricing: 'expenseAccount'
      }
    }, {
      name: 'Inventory Aisle Locations',
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
      name: 'Inventory Locations',
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
      name: 'Inventory Types',
      value: 'inventory_types',
      models: {
        inventory: 'inventoryType'
      }
    },{
      defaultValues: 'defaultIncidentLocations',
      name: 'Department Names',
      value: 'incident_locations',
      models: {
        incident: 'locationOfIncident'
      }
    },{
      defaultValues: 'defaultImagingPricingTypes',
      name: 'Imaging Pricing Types',
      value: 'imaging_pricing_types',
      models: {
        pricing: 'pricingType'
      }
    }, {
      defaultValues: 'defaultLabPricingTypes',
      name: 'Lab Pricing Types',
      value: 'lab_pricing_types',
      models: {
        pricing: 'pricingType'
      }
    }, {
      name: 'Patient Status List',
      value: 'patient_status_list',
      models: {
        patient: 'status'
      }
    }, {
      name: 'Physicians',
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
      name: 'Procedures',
      value: 'procedure_list',
      models: {
        procedure: 'description'
      }
    }, {
      name: 'Procedure Locations',
      value: 'procedure_locations',
      models: {
        procedure: 'location'
      }
    }, {
      name: 'Procedure Pricing Types',
      value: 'procedure_pricing_types',
      models: {
        pricing: 'pricingType'
      }
    }, {
      name: 'Radiologists',
      value: 'radiologists',
      model: {
        imaging: 'radiologist'
      }
    }, {
      defaultValues: 'defaultUnitList',
      name: 'Unit Types',
      value: 'unit_types',
      models: {
        inventory: 'distributionUnit',
        'inv-purchase': 'distributionUnit'
      }
    }, {
      name: 'Vendor',
      value: 'vendor_list',
      models: {
        'inv-purchase': 'vendor'
      }
    }, {
      name: 'Visit Locations',
      value: 'visit_location_list',
      models: {
        appointment: 'location',
        visit: 'location'
      }
    }, {
      defaultValues: 'defaultVisitTypes',
      name: 'Visit Types',
      value: 'visit_types',
      models: {
        visit: 'visitType'
      }
    }, {
      name: 'Ward Pricing Types',
      value: 'ward_pricing_types',
      models: {
        pricing: 'pricingType'
      }
    }],

    importFile: Ember.computed.alias('lookupTypeList.importFile'),

    isLookupTypeNameValue: function() {
      var lookupDesc  = this.get('lookupDesc');
      if (!Ember.isEmpty(lookupDesc)) {
        return lookupDesc.nameValuePair;
      }
    }.property('lookupDesc'),

    lookupDesc: function() {
      var lookupType = this.get('model.lookupType'),
        lookupTypes = this.get('lookupTypes'),
        lookupDesc;
      if (!Ember.isEmpty(lookupType)) {
        lookupDesc = lookupTypes.findBy('value', lookupType);
        return lookupDesc;
      }
    }.property('model.lookupType'),

    lookupTitle: function() {
      var lookupDesc  = this.get('lookupDesc');
      if (!Ember.isEmpty(lookupDesc)) {
        return lookupDesc.name;
      }
    }.property('lookupDesc'),

    lookupTypeList: function() {
      var lookupType = this.get('model.lookupType'),
        lookupItem;
      if (!Ember.isEmpty(lookupType)) {
        lookupItem = this.get('model').findBy('id', lookupType);
        if (Ember.isEmpty(lookupItem) || !lookupItem.get('isLoaded')) {
          var defaultValues = [],
            lookupTypes = this.get('lookupTypes'),
            lookupDesc = lookupTypes.findBy('value', lookupType),
            store = this.get('store');
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
    }.property('model.lookupType'),

    lookupTypeValues: function() {
      var values = this.get('lookupTypeList.value');
      if (!Ember.isEmpty(values)) {
        values.sort(this._sortValues);
      }
      return Ember.ArrayProxy.create({ content: Ember.A(values) });
    }.property('model.lookupType', 'lookupTypeList.value'),

    organizeByType: Ember.computed.alias('lookupTypeList.organizeByType'),

    showOrganizeByType: function() {
      var lookupType = this.get('model.lookupType');
      return (!Ember.isEmpty(lookupType) && lookupType.indexOf('pricing_types') > 0);
    }.property('model.lookupType'),

    userCanAdd: Ember.computed.alias('lookupTypeList.userCanAdd'),

    _canDeleteValue: function(value) {
      var lookupType = this.get('model.lookupType');
      switch (lookupType) {
        case 'inventory_types': {
          if (value === 'Medication') {
            this.displayAlert('Cannot Delete Medication', 'The Medication inventory type cannot be deleted because it is needed for the Medication module.');
            return false;
          }
          break;
        }
        case 'lab_pricing_types': {
          if (value === 'Lab Procedure') {
            this.displayAlert('Cannot Delete Lab Pricing Type', 'The Lab Procedure pricing type cannot be deleted because it is needed for the Labs module.');
            return false;
          }
          break;
        }
        case 'imaging_pricing_types': {
          if (value === 'Imaging Procedure') {
            this.displayAlert('Cannot Delete Imaging Pricing Type', 'The Imaging Procedure pricing type cannot be deleted because it is needed for the Imaging module.');
            return false;
          }
          break;
        }
        case 'visit_types': {
          if (value === 'Admission') {
            this.displayAlert('Cannot Delete Admmission Visit Type', 'The Admission Visit type cannot be deleted because it is needed for the Visits module.');
            return false;
          } else if (value === 'Imaging') {
            this.displayAlert('Cannot Delete Imaging Visit Type', 'The Imaging Visit type cannot be deleted because it is needed for the Imaging module.');
            return false;
          } else if (value === 'Lab') {
            this.displayAlert('Cannot Delete Lab Visit Type', 'The Lab Visit type cannot be deleted because it is needed for the Lab module.');
            return false;
          } else if (value === 'Pharmacy') {
            this.displayAlert('Cannot Delete Pharmacy Visit Type', 'The Lab Visit type cannot be deleted because it is needed for the Medication module.');
            return false;
          }
        }
      }
      return true;
    },

    _sortValues: function(a, b) {
      if (a instanceof Object) {
        return Ember.compare(a.name.toLowerCase(), b.name.toLowerCase());
      } else {
        return Ember.compare(a.toLowerCase(), b.toLowerCase());
      }

    },

    actions: {
      addValue: function() {
        var isLookupTypeNameValue = this.get('isLookupTypeNameValue');
        this.send('openModal', 'admin.lookup.edit', Ember.Object.create({
          isNew: true,
          isLookupTypeNameValue: isLookupTypeNameValue
        }));
      },
      deleteValue: function(value) {
        var isLookupTypeNameValue = this.get('isLookupTypeNameValue'),
          lookupTypeList = this.get('lookupTypeList'),
          lookupTypeValues = lookupTypeList.get('value');
        if (this._canDeleteValue(value)) {
          if (isLookupTypeNameValue) {
            lookupTypeValues.removeObject(value);
          } else {
            lookupTypeValues.removeObject(value.toString());
          }
          lookupTypeList.save();
        }
      },
      editValue: function(value) {
        if (!Ember.isEmpty(value)) {
          var isLookupTypeNameValue = this.get('isLookupTypeNameValue');
          var editObject =  Ember.Object.create({
            isNew: false,
            isLookupTypeNameValue: isLookupTypeNameValue,
            originalValue: value
          });
          if (isLookupTypeNameValue) {
            editObject.set('name', value.name.toString());
            editObject.set('value', value.value.toString());
          } else {
            editObject.set('value', value.toString());
          }
          this.send('openModal', 'admin.lookup.edit', editObject);
        }
      },
      importList: function() {
        var fileSystem = this.get('fileSystem'),
          fileToImport = this.get('importFile'),
          lookupTypeList = this.get('lookupTypeList');
        if (!fileToImport || !fileToImport.type) {
          this.displayAlert('Select File To Import', 'Please select file to import.');
        } else {
          fileSystem.fileToDataURL(fileToImport).then(function(fileDataUrl) {
            var dataUrlParts = fileDataUrl.split(',');
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
              this.displayAlert('List Imported', 'The lookup list has been imported.', 'refreshLookupLists');
              this.set('importFile');
              this.set('model.importFileName');
            }.bind(this));
          }.bind(this));
        }
      },
      updateList: function() {
        var lookupTypeList = this.get('lookupTypeList');
        lookupTypeList.save().then(function() {
          this.displayAlert('List Saved', 'The lookup list has been saved');
        }.bind(this));
      },
      updateValue: function(valueObject) {
        var updateList = false,
          isLookupTypeNameValue = this.get('isLookupTypeNameValue'),
          lookupTypeList = this.get('lookupTypeList'),
          lookupTypeValues = this.get('lookupTypeValues'),
          values = lookupTypeList.get('value'),
          value;
        if (isLookupTypeNameValue) {
          value = valueObject.getProperties('name', 'value');
        } else {
          value = valueObject.get('value');
        }
        if (valueObject.get('isNew')) {
          updateList = true;
        } else {
          var originalValue = valueObject.get('originalValue');
          if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
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
            var values = Ember.copy(list.get('value'));
            lookupTypeValues.clear();
            lookupTypeValues.addObjects(values);
          });

        }
      }
    }
  });
