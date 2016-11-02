import Ember from 'ember';
import PatientName from 'hospitalrun/mixins/patient-name';
import TypeAhead from 'hospitalrun/components/type-ahead';
export default TypeAhead.extend(PatientName, {
  displayKey: 'name',
  setOnBlur: true,

  _mapPatient: function(item) {
    let returnObj = {};
    returnObj.name = `${this.getPatientDisplayName(item)} - ${this.getPatientDisplayId(item)}`;
    returnObj[this.get('selectionKey')] = item;
    return returnObj;
  },

  contentChanged: function() {
    let bloodhound = this.get('bloodhound');
    let content = this.get('content');
    if (bloodhound) {
      bloodhound.clear();
      if (!Ember.isEmpty(content)) {
        bloodhound.add(content.map(this._mapPatient.bind(this)));
      }
    }
  }.observes('content.[]'),

  mappedContent: function() {
    let content = this.get('content');
    let mapped = [];
    if (content) {
      mapped = content.map(this._mapPatient.bind(this));
    }
    return mapped;
  }.property('content')

});
