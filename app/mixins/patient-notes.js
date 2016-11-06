import Ember from 'ember';
export default Ember.Mixin.create({

  canAddNote: function() {
    return this.currentUserCan('add_note') && (!Ember.isEmpty(this.get('visits')) || !Ember.isEmpty(this.get('model.visits')));
  },

  canDeleteNote: function() {
    return this.currentUserCan('delete_note');
  },

  _computeNoteType: function(visit) {
    switch (visit.get('visitType')) {
      case 'Admission':
        if (Ember.isEmpty(visit.get('procedures'))) {
          return 'Pre-op';
        } else {
          return 'Post-op';
        }
      case 'Clinic':
      case 'Followup':
        return 'General';
      default:
        return visit.get('visitType');
    }
  },

  _setNoteType: function() {
    let model = this.get('model');
    if (model.get('noteType') == null) {
      model.set('noteType', this._computeNoteType(model.get('visit')));
    }
  }
});