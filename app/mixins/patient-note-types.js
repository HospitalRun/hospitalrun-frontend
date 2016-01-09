import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  patientNoteTypesList: [
    'General',
    'Clinic',
    'Procedure',
    'Imaging',
    'Lab',
    'Pharmacy',
    // 'Physiotherapy',
    'Social',
    'Other'
  ],
  patientNoteTypes: Ember.computed.map('patientNoteTypesList', SelectValues.selectValuesMap),

  patientNoteTypesWithEmpty: function() {
    return SelectValues.selectValues(this.get('patientNoteTypesList'), true);
  }.property()

});