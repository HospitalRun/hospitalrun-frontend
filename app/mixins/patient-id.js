<<<<<<< HEAD
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
=======
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';
import FriendlyId from 'hospitalrun/mixins/friendly-id';

export default Mixin.create(FriendlyId, {
  config: service(),
  sequenceName: 'patient',
  sequenceView: 'patient_by_display_id',

  sequencePrefix() {
    let config = get(this, 'config');
    return config.getPatientPrefix();
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
