import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  queryParams: {
    forPatientId: {
      refreshModel: false
    },
    forVisitId: {
      refreshModel: false
    }
  },

  model(params) {
    let idParam = get(this, 'idParam');
    let modelPromise = this._super(params);
    if (params[idParam] === 'new') {
      if (!isEmpty(params.forPatientId)) {
        return this._setPatientOnModel(modelPromise, params.forPatientId);
      } else if (!isEmpty(params.forVisitId)) {
        return this._setVisitOnModel(modelPromise, params.forVisitId);
      } else {
        return this._createNewRecord(params);
      }
    } else {
      return modelPromise;
    }
  },

  /**
   * Resolves the model promise and then sets the patient information on the model.
   */
  _setPatientOnModel(modelPromise, patientId) {
    let store = get(this, 'store');
    return modelPromise.then((model) => {
      return store.find('patient', patientId).then((patient) => {
        model.set('patient', patient);
        model.set('returnToPatient', patientId);
        model.set('selectPatient', false);
        return model;
      });
    });
  },

  /**
   * Resolves the model promise and then sets the visit information on the model.
   */
  _setVisitOnModel(modelPromise, visitId) {
    let store = get(this, 'store');
    return modelPromise.then((model) => {
      return store.find('visit', visitId).then((visit) => {
        model.set('visit', visit);
        model.set('returnToVisit', visitId);
        model.set('selectPatient', false);
        model.set('patient', visit.get('patient'));
        return model;
      });
    });
  }
});
