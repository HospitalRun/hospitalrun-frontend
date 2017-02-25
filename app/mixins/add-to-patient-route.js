import Ember from 'ember';

const { get, isEmpty, Mixin } = Ember;

export default Mixin.create({
  queryParams: {
    forPatientId: {
      refreshModel: false
    }
  },

  model(params) {
    let idParam = get(this, 'idParam');
    let modelPromise = this._super(params);
    if (!isEmpty(params.forPatientId) && params[idParam] === 'new') {
      return this._setPatientOnModel(modelPromise, params.forPatientId);
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
  }
});
