import Ember from 'ember';
export default {
  patientTypeAhead: {
    acceptance: {
      accept: true,
      if: function (object) {
        if (!object.get('selectPatient')) {
          return false;
        }
        if (!object.get('isDirty')) {
          return false;
        }
        var patientName = object.get('patient.displayName'),
          patientTypeAhead = object.get('patientTypeAhead');
        if (Ember.isEmpty(patientName) || Ember.isEmpty(patientTypeAhead)) {
          // force validation to fail
          return true;
        } else {
          var typeAheadName = patientTypeAhead.substr(0, patientName.length);
          if (patientName !== typeAheadName) {
            return true;
          }
        }
        // patient is properly selected; don't do any further validation
        return false;
      },
      message: 'Please select a patient'
    }
  }
};
