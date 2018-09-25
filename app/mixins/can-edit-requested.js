import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  canEdit: computed('status', function() {
    let status = this.get('status');
    return (status === 'Requested');
  })
});
