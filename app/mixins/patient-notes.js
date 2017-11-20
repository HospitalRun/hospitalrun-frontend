import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
export default Mixin.create({

  canAddNote() {
    return this.currentUserCan('add_note') && (!isEmpty(this.get('visits')) || !isEmpty(this.get('model.visits')));
  },

  canDeleteNote() {
    return this.currentUserCan('delete_note');
  },

  _computeNoteType(visit) {
    switch (visit.get('visitType')) {
      case 'Admission':
        if (isEmpty(visit.get('procedures'))) {
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

  _setNoteType() {
    let model = this.get('model');
    if (model.get('noteType') == null) {
      model.set('noteType', this._computeNoteType(model.get('visit')));
    }
  }
});