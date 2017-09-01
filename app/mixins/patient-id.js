import Ember from 'ember';
import FriendlyId from 'hospitalrun/mixins/friendly-id';

const { get, inject } = Ember;

export default Ember.Mixin.create(FriendlyId, {
  config: inject.service(),
  sequenceName: 'patient',
  sequenceView: 'patient_by_display_id',

  sequencePrefix() {
    let config = get(this, 'config');
    return config.getPatientPrefix();
  }
});
