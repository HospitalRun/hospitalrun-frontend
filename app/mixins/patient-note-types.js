import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  patientNoteTypesList: [
    'Clinic',
    'Pre-op',
    'Procedural',
    'Post-op',
    'Physio',
    'Imaging',
    'Lab',
    'Pharmacy',
    'Social',
    'Other'
  ],
  patientNoteTypes: Ember.computed.map('patientNoteTypesList', SelectValues.selectValuesMap),

  patientNoteTypesWithEmpty: function() {
    return SelectValues.selectValues(this.get('patientNoteTypesList'), true);
  }.property()

});