import Ember from 'ember';

export default Ember.Mixin.create({
  
  canAddNote: function() {
    return this.currentUserCan('add_note');
  },

  canDeleteNote: function() {
    return this.currentUserCan('delete_note');
  },
  
  _computeNoteType: function(visit) {
    switch (visit.get('visitType')) {
      case 'Admission':
        if (Ember.isEmpty(visit.get('procedure')) {
          return 'Pre-op';
        } else {
          return 'Post-op';
        }
        break;
      case 'Clinic':
      case 'Followup':
        return 'General';
        break;
      default:
        return visit.get('visitType');
        break;
    }
  },
  
  _setNoteType: function() {
    var model = this.get('model');
    if (model.get('noteType') == null) {
      model.set('noteType', this._computeNoteType(model.get('visit')));
    }
  },
  
  actions: {
    showAddPatientNote: function(model) {
      if (Ember.isEmpty(model)) {
        model = this.get('store').createRecord('patient-note', { 
          patient: this.get('model')
        });
      }
      this.send('openModal', 'patients.notes', model);
    }
  }
  
});
