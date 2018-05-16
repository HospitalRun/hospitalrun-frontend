<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Mixin.create({
  canEdit: function() {
    let status = this.get('status');
    return (status === 'Requested');
  }.property('status')
});
=======
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  canEdit: function() {
    let status = this.get('status');
    return (status === 'Requested');
  }.property('status')
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
