import { resolve } from 'rsvp';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { t } from 'hospitalrun/macro';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!
import moment from 'moment';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import uuid from 'uuid';

export default AbstractEditRoute.extend(AddToPatientRoute, FulfillRequest, InventoryLocations, PatientListRoute, {
  editTitle: t('medication.titles.editMedicationRequest'),
  modelName: 'medication',
  newTitle: t('medication.titles.newMedicationRequest'),
  database: service(),
  getNewData(params) {
    let idParam = this.get('idParam');
    let newData = {
      selectPatient: true,
      prescriptionDate: moment().startOf('day').toDate()
    };
    if (params[idParam] === 'dispense') {
      newData.shouldFulfillRequest = true;
      newData.hideFulfillRequest = true;
    }
    newData.id = uuid.v4();
    return resolve(newData);
  },

  model(params) {
    let idParam = this.get('idParam');
    let modelPromise = this._super(params);
    if (!isEmpty(idParam) && params[idParam] === 'new' || params[idParam] === 'dispense') {
      if (!isEmpty(params.forPatientId)) {
        return this._setPatientOnModel(modelPromise, params.forPatientId);
      } else if (!isEmpty(params.forVisitId)) {
        return this._setVisitOnModel(modelPromise, params.forVisitId);
      } else {
        return this._createNewRecord(params);
      }
    } else {
      return this._super(params);
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    let inventoryQuery = {
      key: 'Medication',
      include_docs: true
    };
    let inventoryItemId = model.get('inventoryItem.id');
    let patient = model.get('patient');
    if (isEmpty(inventoryItemId)) {
      this.get('database').queryMainDB(inventoryQuery, 'inventory_by_type')
        .then(function(result) {
          let medicationList = result.rows.map(function(medication) {
            return medication.doc;
          });
          controller.set('medicationList', medicationList);
        });
    }
    if (isEmpty(patient)) {
      this._fetchPatientList(controller);
    }
  }
});
