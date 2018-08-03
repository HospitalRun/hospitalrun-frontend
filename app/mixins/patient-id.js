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
