import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  patientNoteTypesList: [
    'General',
    'Appointment',
    'Clinic',
    'Lab',
    'Pharmacy',
    'Imaging',
    'Pre-op',
    'Procedural',
    'Post-op',
    'Physio',
    'Social',
    'Other'
  ],
  patientNoteTypes: Ember.computed.map('patientNoteTypesList', SelectValues.selectValuesMap),

  patientNoteTypesWithEmpty: function() {
    return SelectValues.selectValues(this.get('patientNoteTypesList'), true);
  }.property()

});